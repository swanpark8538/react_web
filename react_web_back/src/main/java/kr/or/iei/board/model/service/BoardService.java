package kr.or.iei.board.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.board.model.dao.BoardDao;
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
	
	
}
