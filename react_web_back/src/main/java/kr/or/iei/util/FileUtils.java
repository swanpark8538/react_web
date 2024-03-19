package kr.or.iei.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class FileUtils {
	
	//저장경로와 파일객체를 매개변수로 받아서, 해당 저장경로에 파일명이 중복되지 않도록 업로드하고, 업로드한 파일명을 리턴
	public String upload(String savepath, MultipartFile file) {
		
		//원본파일명 추출. 만약 파일명이 test.txt라면
		String filename = file.getOriginalFilename();
		
		//test(파일명)와 .txt(확장자)로 나눠서 분류
		String onlyFilename = filename.substring(0, filename.lastIndexOf("."));//test
		String extention = filename.substring(filename.lastIndexOf("."));//.txt
		
		//실제로 업로드할 파일명 변수 선언
		String filepath = null;
		
		//중복파일명이 있으면 1씩 증가시키면서 파일명 뒤에 붙일 숫자
		int count = 0;
		
		//파일명 중복체크 시작
		while(true) {
			if(count == 0) {
				//반복 1회차(최초)에 숫자를 붙이지 않고 바로 검증
				filepath = onlyFilename+extention;
			}else {
				//반복 2회차부터 파일명에 숫자를 붙여서 생성
				filepath = onlyFilename + "_" + count + extention; // test1_1.txt
			}
			//위에 if문에서 만든 파일명이 사용중인지 체크. new File(경로+파일명) = 이 경로에 있는 이 파일명의 파일을 열어라(가져와라)
			File checkFile = new File(savepath+filepath);
			if(!checkFile.exists()) {//파일이 존재하지 않을 때(=파일명 중복X)
				break;
			}//파일이 존재할 때(=파일명 중복O)
			count++;
		}
		//파일명 중복체크 끝 -> 내가 업로드할 파일명 결정 -> 파일 업로드 진행
		try {
			//중복처리 끝난 파일명으로 파일 업로드 진행
			file.transferTo(new File(savepath+filepath));
		} catch (IllegalStateException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return filepath;
	}

	public void downloadFile(String savepath, String filename, String filepath, HttpServletResponse response) {
		String downFile = savepath + filepath;
		try {
			//1. DB의 file → 서버
			//파일을 JAVA로 읽어오기 위한 주스트림 생성
			FileInputStream fis = new FileInputStream(downFile);
			//속도개선을 위한 보조스트림 생성
			BufferedInputStream bis = new BufferedInputStream(fis);
			
			//2. 서버 → 사용자
			//읽어온 파일을 사용자에게 내보내기 위한 주스트림 생성
			ServletOutputStream sos = response.getOutputStream();
			//속도개선을 위한 보조스트림 생성
			BufferedOutputStream bos = new BufferedOutputStream(sos);
			
			//3. 다운로드할 파일명(사용자가 받았을 때의 파일명)이 깨지지 않도록 처리
			String resFilename = new String(filename.getBytes("UTF-8"),"ISO-8859-1");
			
			//4. 파일을 다운로드 하기 위한 HTTP 헤더 설정
			response.setContentType("application/octet-stream");//파일이란거 알려주는 코드
			response.setHeader("Content-Disposition", "attatchment;filename="+resFilename);//파일명 알려주는 코드
			
			//5. 파일 전송
			while(true) {
				int read = bis.read();//인풋스트림으로 읽어오고
				if(read != -1) {//읽어온 값이 있을때
					bos.write(read);//그 읽어온 것을 아웃스트림으로 내보냄
				}else {//읽어온 값이 없을때(read == -1)
					break;//파일전송 그만하고 나가
				}
			}
			//5. 스트림 닫기
			bos.close();
			bis.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void deleteFile(String savepath, String filepath) {
		//java.io의 File객체 생성
		File delFile = new File(savepath+filepath);
		//File의 내장함수 delete 실행
		delFile.delete();
		
	}
}
