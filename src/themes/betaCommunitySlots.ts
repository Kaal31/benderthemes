import type {Friend} from '../activity';

export type CommunitySlot=Friend&{placeholder?:boolean};

/** Keep the composition full without inventing friends or online presence. */
export function communitySlots(friends:Friend[],minimum:number):CommunitySlot[]{
 const slots:CommunitySlot[]=[...friends];
 while(slots.length<minimum)slots.push({id:'beta-empty-friend:'+slots.length,name:'Empty slot',online:false,placeholder:true});
 return slots;
}
