import React from 'react';

interface Member {
  id: string;
  lastName: string;
  firstName: string;
  grade: string;
}

interface MemberRowProps {
  member: Member;
}

const MemberRow: React.FC<MemberRowProps> = ({ member }) => {
  return (
    <tr className="text-center">
      <td className="py-2 px-4 border-b">
        {member.lastName} {member.firstName}
      </td>
      <td className="py-2 px-4 border-b">{member.grade}</td>
    </tr>
  );
};

export default MemberRow;
