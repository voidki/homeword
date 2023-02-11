import Cookies from "js-cookie";

const TokenKey = "Admin-Token";
const Avatar = "Admin-Avatar";
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
export function getAvatar() {
  return Cookies.get(Avatar);
}

export function setAvatar(avatar) {
  return Cookies.set(Avatar, avatar);
}

export function removeAvatar() {
  return Cookies.remove(Avatar);
}
