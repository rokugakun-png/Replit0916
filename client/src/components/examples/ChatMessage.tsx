import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  const mockMessages = [
    {
      id: "1",
      content: "最近、職場でのコミュニケーションがうまくいかなくて悩んでいます。特にチームメンバーとの意見交換がスムーズにできずに困っています。",
      isFromUser: true,
      timestamp: "14:30"
    },
    {
      id: "2",
      content: "お疲れ様です。職場でのコミュニケーションに関するお悩み、とてもよく理解できます。まず、具体的にどのような場面で困ることが多いでしょうか？\n\n例えば、会議での発言、日常的な相談、プロジェクトの進捗報告など、どのような状況で特に難しさを感じているか教えていただけますか？\n\nまた、これまでにうまくコミュニケーションが取れた経験があれば、その時の状況もお聞かせください。そこからヒントを見つけられるかもしれません。",
      isFromUser: false,
      timestamp: "14:32",
      characterName: "田中先生",
      characterRole: "doctor",
      characterAvatar: ""
    }
  ];

  return (
    <div className="space-y-4">
      {mockMessages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
}