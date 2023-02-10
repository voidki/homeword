import request from "@/utils/request";
// 查询商品列表
export function listProduct(query) {
  return request({
    url: "/product/list",
    method: "get",
    params: query,
  });
}

// 修改商品信息
export function updateProduct(data) {
  return request({
    url: "/product/update",
    method: "put",
    data: data,
  });
}
// 删除商品
export function delProduct(productId) {
  return request({
    url: "/product/delete/" + productId,
    method: "delete",
  });
}
// 新增用户
export function addProduct(data) {
  return request({
    url: "/product/add",
    method: "post",
    data: data,
  });
}
// 查询商品详细
export function getProduct(productId) {
  return request({
    url: "/product/" + productId,
    method: "get",
  });
}
