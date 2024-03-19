package kr.or.iei.board.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.iei.ResponseDTO;
import kr.or.iei.board.model.dto.Board;
import kr.or.iei.board.model.dto.BoardFile;
import kr.or.iei.board.model.service.BoardService;
import kr.or.iei.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/board")
@Tag(name="BOARD", description = "BOARD API")
public class BoardController {

	@Autowired
	private BoardService boardService;
	@Autowired
	private FileUtils fileUtils;
	@Value("${file.root}")
	private String root;
	
	@GetMapping(value="/list/{reqPage}")
	public ResponseEntity<ResponseDTO> boardList(@PathVariable int reqPage){
		//리턴 정보에는 board객체 배열 뿐만 아니라 pageInfo도 필요함
		//새로운 vo 만들기 싫어서 hashmap 사용.
		Map map = boardService.selectBoardList(reqPage);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
	
	@PostMapping(value="/editor")
	public ResponseEntity<ResponseDTO> editorUpload(@ModelAttribute MultipartFile image){
		//MultipartFile 타입으로 데이터가 전송되면 @ModelAttribute로 받으면 됨
		//보내는 데이터인 form객체를 보면 form.append("image", files[0]); //key,value
		//키 image를 받아오면 됨
		String savepath = root + "/boardEditor/";// 슬래시 마지막에 꼭 붙여라 하...
		//String filename = image.getOriginalFilename();
		String filepath = fileUtils.upload(savepath, image);
		String returnPath = "/board/editor/" + filepath;
		
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", returnPath);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
	
	@PostMapping
	public ResponseEntity<ResponseDTO> insertBoard
	(@ModelAttribute Board board,
	 @ModelAttribute MultipartFile thumbnail,
	 @ModelAttribute MultipartFile[] boardFile,
	 @RequestAttribute String memberId){
		//axios로 받아온 form객체의 키 : boardTitle, boardContent, thumbnail, boardFile
		//인터셉터로 받아온 매개변수 : memberId
		//boardTitle, boardContent, memberId-> board객체
		board.setBoardWriter(memberId);
		String savepath = root + "/board/";
		
		if(thumbnail != null) {
			String filepath = fileUtils.upload(savepath, thumbnail);
			board.setBoardImg(filepath);
		}
		
		ArrayList<BoardFile> fileList = new ArrayList<BoardFile>();
		if(boardFile != null) {
			for(MultipartFile file : boardFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				BoardFile bf = new BoardFile();
				bf.setFilename(filename);
				bf.setFilepath(filepath);
				fileList.add(bf);
			}
		}
		
		int result = boardService.insertBoard(board, fileList);
		if(result == 1+fileList.size()) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@GetMapping(value="/one/{boardNo}")
	public ResponseEntity<ResponseDTO> selectOneBoard(@PathVariable int boardNo){
		Board board = boardService.selectOneBoard(boardNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", board);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
	
	@GetMapping(value="/file/{boardFileNo}")
	public ResponseEntity<Resource> fileDown(@PathVariable int boardFileNo) throws FileNotFoundException{
	//json방식이 아니라 responseType: "blob" 타입으로 받아오겠다고 했으므로
	//import org.springframework.core.io.Resource;
		BoardFile boardFile = boardService.selectOneBoardFile(boardFileNo);
		String savepath = root + "/board/";
		File file = new File(savepath + boardFile.getFilepath());
		Resource resource = new InputStreamResource(new FileInputStream(file));
		//파일 다운로드 헤더 설정(import org.springframework.http.HttpHeaders;)
		HttpHeaders header = new HttpHeaders();
														//filename="파일명"
		header.add("Content-Disposition", "attachment; filename=\""+boardFile.getFilename()+"\"");
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("pragma", "no-cache");
		header.add("Expires", "0");
		
		return ResponseEntity.status(HttpStatus.OK)
							 .headers(header)
							 .contentLength(file.length())
							 .contentType(MediaType.APPLICATION_OCTET_STREAM)
							 .body(resource);
	}
	
	@DeleteMapping(value="/{boardNo}")
	public ResponseEntity<ResponseDTO> deleteBoard(@PathVariable int boardNo){
		//파일 삭제 후, 물리적 파일을 지우기 위해 List로 리턴받음
		List<BoardFile> fileList = boardService.deleteBoard(boardNo);
		if(fileList != null) {
			String savepath = root + "/board/";
			for(BoardFile boardFile : fileList) {
				File file = new File(savepath+boardFile.getFilepath());
				file.delete();
			}
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
}
