package kr.or.iei.board.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="boardFile")
@Schema(description = "첨부파일 객체")
public class BoardFile {

	private int boardFileNo;
	private int boardNo;
	private String filename;
	private String filepath;
}
