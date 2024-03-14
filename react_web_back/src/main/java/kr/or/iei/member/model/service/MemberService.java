package kr.or.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.dao.MemberDao;

@Service
public class MemberService {

	@Autowired
	private MemberDao memberDao;
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	public Member selectOneMember(String memberId) {
		return memberDao.selectOneMember(memberId);
	}

	@Transactional
	public int insertMember(Member member) {
		return memberDao.insertMember(member);
	}

	public Member login(Member requestedMember) {
		Member selectedMember = memberDao.selectOneMember(requestedMember.getMemberId());
		//매퍼를 확인해보면, Id로 회원을 조회했지만 비밀번호는 사용하지 않음.
		//왜냐? 비밀번호는 암호화되어있어서 사용자가 입력한 값과 직접비교 불가
		//BCrypt로 암호화된 값을 비교하는 방법은 BCrypt객체가 제공하는 matches메소드를 활용
		
		//사용자 입력 ID와 DB ID가 같다면 Member객체는 채워진 상태임

		//BCrypt 객체의 matches(param1, param2)메소드를 활용하면 두 값이 같은지 boolean형으로 리턴함
		//param1 : 평문값(사용자가 입력한 암호 = 아직 암호화 전)
		//param2 : 비교대상인 암호화된 값(= DB에 이미 암호화된 값)
		//return : param1을 암호화한 값과, 이미 암호화된 값인 param2가 같으면 true
		if(selectedMember != null && bCryptPasswordEncoder.matches(requestedMember.getMemberPw(), selectedMember.getMemberPw())) {
			//일치 확인했다면, 반환할 Member에서 pw의 값을 제거(보안을 위해)
			selectedMember.setMemberPw(null);
			return selectedMember;
		}else {
			return null;
		}
	}
}
