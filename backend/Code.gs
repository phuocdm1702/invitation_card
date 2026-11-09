const BOOK_ID = '12Gn_rGB2vMO3g6mwbp69ENQSXsRMWpbSV9GGXuv7rW8';
const TAB_ID = 1237818804;
const FLOWERS = {none:'Không tặng hoa',sunflower:'Nắng sân trường','rose-pink':'Hồng thanh xuân',tulip:'Lời hẹn tháng năm',daisy:'Cúc họa mi',baby:'Mây trắng','rose-red':'Điều thương chưa nói',hydrangea:'Trời xanh tuổi 18',lavender:'Một miền ký ức',lily:'Ngày rạng rỡ',lotus:'Mùa nhớ',mixed:'Thanh xuân rực rỡ','forget-me-not':'Đừng quên nhau nhé'};
const ATTENDANCE = {attending:'Sẽ đến',absent:'Bận, không đến được',unsure:'Chưa chắc chắn'};
function reply(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function doGet() { return reply({service:'Lời chúc thanh xuân',ready:true}); }
function doPost(e) {
 const lock=LockService.getScriptLock();
 try {
  if(!e || !e.postData || e.postData.contents.length>16000) return reply({success:false,error:'invalid_request'});
  const data=JSON.parse(e.postData.contents);
  const name=typeof data.name==='string'?data.name.trim():'';
  const wish=typeof data.wish==='string'?data.wish.trim():'';
  if(!name || name.length>100 || !wish || wish.length>2000 || !Object.prototype.hasOwnProperty.call(ATTENDANCE,data.attendance) || !Object.prototype.hasOwnProperty.call(FLOWERS,data.bouquet) || !/^[a-zA-Z0-9-]{16,80}$/.test(data.requestId||'')) return reply({success:false,error:'invalid_fields'});
  if(!lock.tryLock(10000))return reply({success:false,error:'busy'});
  const sheet=SpreadsheetApp.openById(BOOK_ID).getSheets().find(s=>s.getSheetId()===TAB_ID);
  if(!sheet)throw new Error('Missing sheet');
  const last=sheet.getLastRow();
  if(last>1 && sheet.getRange(2,2,last-1,1).createTextFinder(data.requestId).matchEntireCell(true).findNext())return reply({success:true,duplicate:true,requestId:data.requestId});
  // Escape formula prefixes; incoming wishes must remain plain text.
  const text=s=>/^[=+@\-\t\r]/.test(s)?"'"+s:s;
  const row=[Utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh','yyyy-MM-dd HH:mm:ss'),data.requestId,text(name),ATTENDANCE[data.attendance],text(wish),data.bouquet,FLOWERS[data.bouquet]];
  sheet.getRange(last+1,1,1,7).setValues([row]).setWrap(true);
  SpreadsheetApp.flush();
  return reply({success:true,requestId:data.requestId});
 }catch(err){return reply({success:false,error:'save_failed'});}finally{if(lock.hasLock())lock.releaseLock();}
}
