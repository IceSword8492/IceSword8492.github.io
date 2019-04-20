let url = {
  getParams: () => {
    let params = {};
    let param = location.search.substring(1).split("&");
    for (let i = 0; i < param.length; i++)
    {
      let keySearch = param[i].search(/=/);
      let key = "";
      if (keySearch != -1)
      {
        key = param[i].slice(0, keySearch);
      }
      let val = param[i].slice(param[i].indexOf("=", 0) + 1);
      if (key != "")
      {
        params[key] = decodeURI(val);
      }
    }
    return params;
  },
  params: this.getParams()
};

console.log(url.params);