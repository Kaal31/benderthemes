/** BFLYT PAN1: own X/Y in bits 0/2, parent X/Y in bits 4/6.
 * Matches Switch-Toolbox's CAFE/Panes/PAN1 reader and writer.
 */
export function switchPaneOrigin(packed:number){
 return {x:packed&3,y:(packed>>2)&3,parentX:(packed>>4)&3,parentY:(packed>>6)&3};
}
