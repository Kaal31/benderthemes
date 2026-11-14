/** Credit supplied by the theme metadata; repository owners are not inferred as creators. */
export function CreatorCredit({author}:{author?:string}){
 const name=author?.trim();
 if(!name||/^(?:unknown|none|null|original wiiflow theme authors)$/i.test(name))return null;
 return <p className="dht-creator-credit" style={{fontSize:13,lineHeight:1.5,overflowWrap:'anywhere',margin:'8px 0'}}><strong>Creator:</strong> {name}</p>;
}
