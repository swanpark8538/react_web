package kr.or.iei.board.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="board")
@Schema(description = "게시판 객체")
public class Board {

	private int boardNo;
	private String boardTitle;
	private String boardImg;
	private String boardContent;
	private String boardWriter;
	private int boardStatus;
	private String boardDate;
	
	private List fileList;//BOARD_FILE 테이블(첨부파일)
	
	private int[] delFileNo;//수정시
	private int thumbnailCheck;//수정시
}
