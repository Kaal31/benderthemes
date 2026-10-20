import {Game,achievements} from "../library";
import {USER_GENERAL,USER_POSTS} from "./wiiuPlazaUserPosts";

// WaraWara Plaza post lines. {game} is replaced with the title's name.
// General lines work for any game; the playtime, recency and install lines are added when they fit.
export const GENERAL_POSTS=[
 "Who else is playing {game} today?",
 "The music in {game} is so good ♪",
 "Best moment in {game}? Go!",
 "Stuck in {game} again... does anyone have a tip?",
 "{game} is better than people give it credit for. You couldn't change my mind.",
 "Can't stop thinking about {game}.",
 "Whatever even happened to the sequel to {game} anyway?",
 "Just one more round of {game}, then bed. Probably.",
 "Who's your favourite character in {game}?",
 "Playing {game} on the couch tonight. Perfect.",
 "{game} looks so nice on this screen!",
 "Anyone want to talk about {game}? I need to talk about {game}.",
];
const MANY_HOURS=["{hours} hours in {game}. No regrets!","{game} took over my life. {hours} hours and counting."];
const SOME_HOURS=["{game} has taken over my weekend.","{hours} hours so far and I'm loving {game}!"];
const NEW_GAME=["Finally starting {game}! Any tips?","Just tried {game} for the first time!"];
const RECENT=["Played {game} last night. So good!"];
// Achievements, when Steam has them cached: {got} of {total}.
const ACH_DONE=["100% in {game}! Every achievement!!","Finally got the last achievement in {game}. Time for a new game?"];
const ACH_CLOSE=["{got} of {total} achievements in {game}. So close!","Only a few achievements left in {game}..."];
const ACH_SOME=["Just got a new achievement in {game}!","{got} achievements in {game} so far. Any easy ones I'm missing?"];
// Non-Steam shortcuts: emulators, other launchers and classics.
const SHORTCUT=["Retro night with {game}!","{game} still holds up after all these years.","Playing {game} on the go. Love it.","Does anyone remember {game}? Classic!"];
// Time of day and season, from the Deck's clock. These don't need a game.
const TIME_POSTS:{when:(d:Date)=>boolean;lines:string[]}[]=[
 {when:d=>d.getHours()<5,lines:["Late night session! Who else is up?","It's way past bedtime... one more level.","Can't sleep. Playing {game}."]},
 {when:d=>d.getHours()>=5&&d.getHours()<11,lines:["Good morning, everyone!","Morning coffee and {game}. Perfect start.","Early start today!"]},
 {when:d=>d.getHours()>=18,lines:["Good evening, Plaza!","Finally home. Time for {game}!","Evening gaming session, let's go!"]},
 {when:d=>d.getDay()===0||d.getDay()===6,lines:["Weekend! Nothing but {game} planned.","Happy weekend, everyone!"]},
 {when:d=>d.getMonth()===0&&d.getDate()<=3,lines:["Happy New Year, everyone!","New year, new backlog!"]},
 {when:d=>d.getMonth()===1&&d.getDate()===14,lines:["Happy Valentine's Day! ♥","Spending Valentine's Day with {game}. ♥"]},
 {when:d=>d.getMonth()===9&&d.getDate()>=24,lines:["Happy Halloween!! What are you dressing up as?","Spooky season! Playing something scary tonight."]},
 {when:d=>d.getMonth()===11&&d.getDate()>=20&&d.getDate()<=26,lines:["Merry Christmas, everyone!","Got {game} as a gift!","Happy holidays, Plaza!"]},
 {when:d=>d.getMonth()>=5&&d.getMonth()<=7,lines:["Too hot outside. Staying in with {game}.","Summer break means more {game}!"]},
];
// Short answers a nearby Mii gives to the post before it.
export const REPLIES=["Same!!","Yes!!","Me too!","I love {game} too!","Totally agree.","Haha, so true.","Good luck!","Ooh, I should try {game}.","Wait, really?","That's awesome!"];
const NOT_INSTALLED=["Waiting for {game} to download...","I really need to reinstall {game}."];

// Lines written for particular games, keyed by Steam appid. Kept spoiler-free.
export const GAME_POSTS:Record<number,string[]>={
 1091500:["Night City at night is unreal.","Spent an hour just changing my jacket.","Which life path did you pick?","Driving around listening to the radio is the best part."], // Cyberpunk 2077
 1245620:["Try finger but hole","Finally beat that boss after 40 tries!!","Is it just me or is every dog in this game out to get me?","Summoned help. No shame."], // Elden Ring
 1145360:["Dad, I'm going out again.","Got a new best run tonight!","Which weapon aspect do you all use?","I could listen to this soundtrack forever."], // Hades
 1145350:["Back in the Underworld!","New witch, same good music.","Which Arcana cards are you running?"], // Hades II
 367520:["Lost all my Geo again...","Where is the map seller??","Those bugs are so cute. Until they're not.","Found a whole new area by accident!"], // Hollow Knight
 413150:["My farm is finally starting to look nice.","Who did you marry? No wrong answers.","Got distracted fishing for three in-game days.","Ancient fruit wine is the way."], // Stardew Valley
 2379780:["Just one more run. Again.","I was so close to a huge score!!","Is it a flush build or nothing for you?","My hands won't stop shuffling."], // Balatro
 1086940:["Rolled a 1. Of course I did.","My whole party is a disaster and I love them.","Spent two hours in character creation.","Talked my way out of a fight. Proud."], // Baldur's Gate 3
 782330:["Rip and tear!!","This soundtrack hits so hard.","Glory kill everything!"], // DOOM Eternal
 1687950:["Take your time ♪","Planning my calendar like it's a real job.","The menus in this game are so stylish."], // Persona 5 Royal
 292030:["Playing Gwent instead of saving the world.","The side quests here are better than most games.","Roach, where are you going?"], // The Witcher 3
 620:["The cake is a...","Thinking with portals today.","Co-op with a friend is the best."], // Portal 2
 105600:["Built a house before the first night!","Who else has a giant storage room?","Hardmode time. Wish me luck."], // Terraria
 504230:["Died a few hundred times. Still having fun.","That last strawberry was so hard!!","The music in this game is amazing."], // Celeste
 1794680:["Just survived 30 minutes!","So many things on screen I can't see my own guy.","Why is this so relaxing?"], // Vampire Survivors
 1868140:["Diving by day, sushi by night.","Found a new fish today!","My restaurant is finally popular!"], // Dave the Diver
 548430:["Rock and Stone!","Did I hear a Rock and Stone?","Who left the beer on the drop pod?"], // Deep Rock Galactic
 553850:["For democracy!","Called in an airstrike on myself. Again.","Anyone want to dive tonight?"], // Helldivers 2
 1966720:["I swear I heard something in the hallway...","Made quota by one scrap!","Don't leave me in the facility!!"], // Lethal Company
 646570:["One more run, then sleep. Okay, two.","Which character do you play the most?","Finally beat it with all three!"], // Slay the Spire
 1174180:["Just went fishing for an hour. Peaceful.","My horse is my best friend.","The sunsets in this game..."], // Red Dead Redemption 2
 1774580:["Lightsaber stance swapping is so fun.","BD-1 is the cutest.","Exploring every corner of this planet!"], // Star Wars Jedi: Survivor
 753640:["I need to tell someone about this but I can't spoil it!","Roasting marshmallows by the campfire.","Go in blind, trust me."], // Outer Wilds
 268910:["You can't beat a boss without trying again!","Finally got an A+ grade!","The art in this game is gorgeous."], // Cuphead
 391540:["* You feel like you're going to have a good time.","Spared everyone. Feeling good.","The music in this game!!"], // Undertale
 264710:["The ocean is beautiful and terrifying.","Built my first base under the sea!","Something big just swam past me..."], // Subnautica
 252950:["What a save!","Calculated.","Anyone up for 2v2?"], // Rocket League
};

const fill=(line:string,game:Game,hours:number)=>line.replace(/\{game\}/g,game.name).replace(/\{hours\}/g,String(hours));

/** A short reply to someone else's post about the same game. */
export function replyFor(game:Game|undefined,seed:number){const line=REPLIES[seed%REPLIES.length];return game?fill(line,game,0):line.replace(/\{game\}/g,"that");}

export type PlazaPost={text:string;follow?:string;appSpecific?:boolean};

/** A written follow-up belongs only to its parent; never replace it when cooling down. */
export function replyTo(post:{game?:Game;follow?:string},seed:number,allows:(text:string)=>boolean):string|undefined{
 if(post.follow)return allows(post.follow)?post.follow:undefined;
 for(let n=0;n<REPLIES.length;n++){const text=replyFor(post.game,seed+n);if(allows(text))return text;}
 return undefined;
}


/** A post for one Mii about one game. The owner's lines for that appid come first, then the written ones, then the rest.
 *  A follow-up, when there is one, is said next by a Mii standing nearby. */
export function postFor(game:Game|undefined,seed:number,allows:(text:string)=>boolean=()=>true):PlazaPost|undefined{
 const choose=(rows:PlazaPost[])=>{for(let n=0;n<rows.length;n++){const row=rows[(seed+n)%rows.length];if(allows(row.text))return row;}return undefined;};
 // Exhaust unused app-specific writing before considering general conversation.
 const mine=game?USER_POSTS[game.appid]:undefined,own=game?GAME_POSTS[game.appid]:undefined;
 const custom=choose((mine??[]).map(([text,follow])=>({text,follow,appSpecific:true})));if(custom)return custom;
 const written=choose((own??[]).map(text=>({text,appSpecific:true})));if(written)return written;
 const general=choose(USER_GENERAL.map(([text,follow])=>({text,follow})));if(general)return general;
 for(let n=0;n<256;n++){const text=writtenPost(game,seed+n);if(allows(text))return {text};}
 return undefined;
}

function writtenPost(game:Game|undefined,seed:number){
 if(!game)return "Anyone around? ♪";
 const hours=Math.floor(game.playtime/60),days=game.lastPlayed?(Date.now()/1000-game.lastPlayed)/86400:999;
 const own=GAME_POSTS[game.appid],now=new Date(),timely=TIME_POSTS.filter(t=>t.when(now)).flatMap(t=>t.lines);
 if(own?.length&&seed%5<3)return own[Math.floor(seed/5)%own.length];
 // About one post in eight follows the clock or the season.
 if(timely.length&&seed%8===3)return fill(timely[Math.floor(seed/8)%timely.length],game,hours);
 const ach=game.shortcut?null:achievements(game),got=ach?.unlocked??0,total=ach?.total??0;
 const achLines=!total||!got?[]:got>=total?ACH_DONE:got/total>=.8?ACH_CLOSE:ACH_SOME;
 const lines=[...(game.shortcut?SHORTCUT:[]),...GENERAL_POSTS,...(hours>=50?MANY_HOURS:hours>=5?SOME_HOURS:NEW_GAME),...(days<2?RECENT:[]),...(!game.installed&&!game.shortcut?NOT_INSTALLED:[]),...achLines,...achLines];
 return fill(lines[seed%lines.length],game,hours).replace(/\{got\}/g,String(got)).replace(/\{total\}/g,String(total));
}

// Posts that show one of the owner's own Steam screenshots. The caption is used when they wrote one.
const SHOT_POSTS=["Look at this view in {game}!","Took a screenshot in {game}. How's it look?","Had to share this moment from {game}.","Screenshot time! {game} is so pretty.","Can you guess where this is in {game}?"];
export function shotPost(game:Game,seed:number,caption:string){return caption.trim()?caption.trim():fill(SHOT_POSTS[seed%SHOT_POSTS.length],game,0);}
