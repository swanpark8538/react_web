package kr.or.iei.util;

import org.springframework.stereotype.Component;

@Component
public class PagiNation {

	public PageInfo getPageInfo(int reqPage, int numPerPage, int pageNaviSize, int totalCount) {
		int end = reqPage*numPerPage;	//한 페이지의 마지막 게시물 번호
		int start = end-numPerPage+1;	//한 페이지의 첫 게시물 번호
		int totalPage = (int)Math.ceil(totalCount/(double)numPerPage);	//전체 페이지 수. 소수점(나머지) 있으면 올림
		int pageNo = ((reqPage-1)/pageNaviSize)*pageNaviSize + 1;	//페이지네비게이션에서 맨 앞쪽의 페이지번호
		return new PageInfo(start, end, pageNo, pageNaviSize, totalPage);
	}
}
