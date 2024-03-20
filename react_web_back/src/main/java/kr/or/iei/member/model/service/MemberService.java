package kr.or.iei.member.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.member.model.dto.Member;
import kr.or.iei.util.JwtUtil;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.PagiNation;
import kr.or.iei.member.model.dao.MemberDao;

@Service
public class MemberService {

	@Autowired
	private MemberDao memberDao;
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private PagiNation pagination;

	public Member selectOneMember(String memberId) {
		return memberDao.selectOneMember(memberId);
	}

	@Transactional
	public int insertMember(Member member) {
		return memberDao.insertMember(member);
	}

	public String login(Member member) {
		Member m = memberDao.selectOneMember(member.getMemberId());
		//매퍼를 확인해보면, Id로 회원을 조회했지만 비밀번호는 사용하지 않음.
		//왜냐? 비밀번호는 암호화되어있어서 사용자가 입력한 값과 직접비교 불가
		//BCrypt로 암호화된 값을 비교하는 방법은 BCrypt객체가 제공하는 matches메소드를 활용
		
		//사용자 입력 ID와 DB ID가 같다면 Member객체는 채워진 상태임

		//BCrypt 객체의 matches(param1, param2)메소드를 활용하면 두 값이 같은지 boolean형으로 리턴함
		//param1 : 평문값(사용자가 입력한 암호 = 아직 암호화 전)
		//param2 : 비교대상인 암호화된 값(= DB에 이미 암호화된 값)
		//return : param1을 암호화한 값과, 이미 암호화된 값인 param2가 같으면 true
		if(m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			//일치 확인했다면, 반환할 Member에서 pw의 값을 제거(보안을 위해) - 그러나 token을 사용하므로 이제 이건 필요 없음
			//m.setMemberPw(null);
			//그 후 로그인 성공했다는 토큰을 발행해서 전달(accessToken)
			/*
			token에 포함되는 정보 -> jwtUtil 들어가서 확인해봐
			1. 회원을 식별할 수 있는 식별자(여기선 memberId 사용)
			2. 로그인 성공 시각(인증 시작시각)
			3. 로그인 만료 시간(인증 만료시간)
			 */
			long expiredDateMs = 60*60*1000l; //1시간
			String accessToken = jwtUtil.createToken(member.getMemberId(), expiredDateMs);
			return accessToken;
		}else {
			return null;
		}
	}

	@Transactional
	public int updatePhone(Member member) {
		return memberDao.updateMember(member);
	}

	@Transactional
	public int deleteMember(String memberId) {
		return memberDao.deleteMember(memberId);
	}

	public int checkPw(Member member) {
		Member m = memberDao.selectOneMember(member.getMemberId());
		if(m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return 1;
		}else {
			return 0;
		}
	}

	@Transactional
	public int changePwMember(Member member) {
		return memberDao.changePwMember(member);
	}

	///////////////////////////////////////////////////////
	//admin
	
	public Map selectMemberList(int reqPage) {
		int numPerPage = 5;
		int pageNaviSize = 5;
		int totalCount = memberDao.memberTotalCount();
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List memberList = memberDao.selectMemberList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("memberList", memberList);
		map.put("pi", pi);
		return map;
	}

	@Transactional
	public int changeMemberType(Member member) {
		return memberDao.changeMemberType(member);
	}
}
