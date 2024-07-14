import { defHttp } from '/@/utils/http/axios';

enum Api {
  fetchGetId = '/meetingOutline/initId',
  fetchAlldata = '/meetingOutline/view',
  AllDataAddOrUpdateMeeting = '/meetingOutline/addOrUpdateMeeting',
  listDictModel = '/system/sysDict/listDictModel',
  addSpeech = '/speech/addSpeech',
  selectPage = '/meetingOutline/selectPage',
  getShortMeetingList = '/meetingOutline/getShortMeetingList',
  addRecord = '/record/addRecord',
  editRecord = '/record/editRecord',
  getAllSpeech = '/speech/getAllSpeech',
  titleRemove = '/outlineContent/remove',
  checkName = '/vprint/checkName',
  vprintView = '/vprint/view',
  vprintRemove = '/vprint/remove',
  meetingCheckInAddList = '/meetingCheckIn/addList',
  meetingCheckInView = '/meetingCheckIn/view',
  meetingOutLine = '/meetingOutline/remove',
}

export function fetchAlldata(params?: object) {
  return defHttp.get({ url: Api.fetchAlldata, params: params });
}
export function fetchGetId(params?: object) {
  return defHttp.post({ url: Api.fetchGetId, params: params });
}
export function AllDataAddOrUpdateMeeting(params?: object) {
  return defHttp.post({ url: Api.AllDataAddOrUpdateMeeting, params: params });
}
export function addSpeech(params?: object) {
  return defHttp.post({ url: Api.addSpeech, params: params });
}
export function listDictModel(params?: object) {
  return defHttp.get({ url: Api.listDictModel, params: params });
}

export function selectPage(params?: object) {
  return defHttp.get({ url: Api.selectPage, params: params });
}
export function getShortMeetingList(params?: object) {
  return defHttp.get({ url: Api.getShortMeetingList, params: params });
}
export function addRecord(params?: object) {
  return defHttp.post({ url: Api.addRecord, params: params });
}

export function editRecord(params?: object) {
  return defHttp.post({ url: Api.editRecord, params: params });
}
export function titleRemove(params?: object) {
  return defHttp.post({ url: `${Api.titleRemove}?ocId=${params.ocId}` });
}
export function checkName(params?: object) {
  return defHttp.post({ url: `${Api.checkName}?userName=${params.userName}` });
}
export function getAllSpeech(params?: object) {
  return defHttp.get({ url: Api.getAllSpeech, params: params });
}

export function vprintView(params?: object) {
  return defHttp.get({ url: Api.vprintView, params: params });
}
export function meetingCheckInAddList(params?: object) {
  return defHttp.post({ url: `${Api.meetingCheckInAddList}`, params: params });
}
export function meetingCheckInView(params?: object) {
  return defHttp.get({ url: `${Api.meetingCheckInView}`, params: params });
}
export function vprintRemove(params?: object) {
  return defHttp.post({ url: `${Api.vprintRemove}?uvId=${params.uvId}` });
}
export function meetingOutLine(params?: object) {
  return defHttp.post({ url: `${Api.meetingOutLine}?moId=${params.moId}` });
}
