package kr.or.iei.board.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.board.model.dao.BoardDao;
import kr.or.iei.board.model.dto.Board;
import kr.or.iei.board.model.dto.BoardFile;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.PagiNation;

@Service
public class BoardService {

	@Autowired
	private BoardDao boardDao;
	@Autowired
	private PagiNation pagination;
	
	public Map selectBoardList(int reqPage) {
		int numPerPage = 12;	//한 페이지 당 게시물 수
		int pageNaviSize = 5;	//페이지 네비게이션의 길이
		int totalCount = boardDao.totalCount();	//전체 게시물 수(전체 페이지 수를 계산하기 위해)
		//페이징 처리에 필요한 값을 계산해서 객체로 리턴
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = boardDao.selectBoardList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("boardList", list);
		map.put("pi", pi);
		return map;
	}

	@Transactional
	public int insertBoard(Board board, ArrayList<BoardFile> fileList) {
		int result = boardDao.insertBoard(board);
		for (BoardFile bf : fileList) {
			bf.setBoardNo(board.getBoardNo());//selectKey로 board객체의 boardNo에 insert한 값을 넣어놨음
			result += boardDao.insertBoardFile(bf);
		}
		return result;
	}

	public Board selectOneBoard(int boardNo) {
		Board board = boardDao.selectOneBoard(boardNo);
		List list = boardDao.selectOneBoardFileList(boardNo);
		board.setFileList(list);
		return board;
	}

	public BoardFile selectOneBoardFile(int boardFileNo) {
		return boardDao.selectOneBoardFile(boardFileNo);
	}

	@Transactional
	public List<BoardFile> deleteBoard(int boardNo) {
		List<BoardFile> fileList = boardDao.selectOneBoardFileList(boardNo);
		int result = boardDao.deleteBoard(boardNo);
		if(result>0) {
			return fileList;//첨부파일이 없더라도 fileList를 리턴하면 비어있는 list가 return됨. null아님!
		}else {
			return null;
		}
	}

	@Transactional
	public List<BoardFile> updateBoard(Board board, ArrayList<BoardFile> fileList) {
		List<BoardFile> delFileList = new ArrayList<BoardFile>();
		int result = 0;
		int delFileCount = 0;
		//삭제한 파일이 있으면
		if(board.getDelFileNo() != null) {
			delFileCount = board.getDelFileNo().length;
			//리턴할 delFileList 먼저 select
			delFileList = boardDao.selectBoardFile(board.getDelFileNo());
			//조회 다 했으니 이제 삭제
			result += boardDao.deleteBoardFile(board.getDelFileNo());
		}
		//추가한 파일이 있으면
		for(BoardFile bf : fileList) {
			//DB에 등록
			result += boardDao.insertBoardFile(bf);
		}
		//업데이트
		result += boardDao.updateBoard(board);
		if(result == 1+fileList.size()+delFileCount) {
			return delFileList;
		}else {
			return null;
		}
	}
	
	///////////////////////////////////////////////////////
	//admin

	public Map adminBoardList(int reqPage) {
		int numPerPage = 10;
		int pageNaviSize = 5;
		int totalCount = boardDao.adminTotalCount();
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = boardDao.adminBoardList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("boardList", list);
		map.put("pi", pi);
		return map;
	}

	@Transactional
	public int changeBoardStatus(Board board) {
		return boardDao.changeBoardStatus(board);
	}
	
	
}
