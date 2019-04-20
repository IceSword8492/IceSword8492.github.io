let range = 30;
let ctx = document.getElementById('connectionTime').getContext('2d');
let labels = [];
for (let i = 0; i < parseInt(range); i++)
{
  labels.push(datetostr(new Date(new Date - 86400000 * i), "YYYYMMDD"));
}
labels.reverse();
let datasets = [];
for (let member of data)
{
  datasets.push({label: member.nickname, /*backgroundColor: member.backgroundColor,*/ borderColor: member.borderColor, data: []});
  for (let date of labels)
  {
    if (member.connectionTime[date] != undefined)
    {
      datasets[datasets.length-1].data.push({x: date, y: member.connectionTime[date]});
    }
  }
}
let connectionTimeChart = new Chart(ctx, {
  type: "line",
  data:{
    labels: labels,
    datasets: datasets
  },
  options: {
    elements: {
      line: {
          tension: .1
      }
    },
    animation: false
  }
});
let bestneet = null;
let stableneet = null;
let averageneet = null;
let maximumneet = null;
let memberlist = [];
let bestneetarray = [];
let avgneetarray = [];
let sdneetarray = [];
let maximumneetarray = [];
for (let i in data)
{
  memberlist[i] = data[i].nickname;
  for (let j in data[i].connectionTime)
  {
    if (!bestneetarray[i])
    {
      bestneetarray[i] = 0;
      maximumneetarray[i] = 0;
    }
    bestneetarray[i] += data[i].connectionTime[j];
    maximumneetarray[i] = maximumneetarray[i] < data[i].connectionTime[j] ? data[i].connectionTime[j] : maximumneetarray[i];
  }
}
for (let i in bestneetarray)
{
  if (!bestneet)
  {
    bestneet = [memberlist[0], bestneetarray[0]];
  }
  if (bestneet[1] < bestneetarray[i])
  {
    bestneet = [memberlist[i], bestneetarray[i]];
  }
}
for (let i in memberlist)
{
  avgneetarray[i] = bestneetarray[i] / 30;
}
for (let i in memberlist)
{
  let sd = 0;
  for (let j in data[i].connectionTime)
  {
    sd += Math.pow(data[i].connectionTime[j] - avgneetarray[i], 2);
  }
  sd /= 30;
  sdneetarray[i] = Math.sqrt(sd);
}
for (let i in sdneetarray)
{
  if (!stableneet)
  {
    stableneet = [memberlist[0], sdneetarray[0]];
  }
  if (stableneet[1] > sdneetarray[i])
  {
    stableneet = [memberlist[i], sdneetarray[i]];
  }
}
for (let i in avgneetarray)
{
  if (!averageneet)
  {
    averageneet = [memberlist[0], avgneetarray[0]];
  }
  if (averageneet[1] < avgneetarray[i])
  {
    averageneet = [memberlist[i], avgneetarray[i]];
  }
}
for (let i in maximumneetarray)
{
  if (!maximumneet)
  {
    maximumneet = [memberlist[0], maximumneetarray[0]];
  }
  if (maximumneet[1] < maximumneetarray[i])
  {
    maximumneet = [memberlist[i], maximumneetarray[i]];
  }
}
document.getElementById("bestneet").innerHTML = bestneet[0];       // 接続時間の合計が最も長かったメンバー
document.getElementById("stableneet").innerHTML = stableneet[0];   // 接続時間の標準偏差が最も小さかったメンバー
document.getElementById("averageneet").innerHTML = averageneet[0]; // 平均接続時間が最も長かったメンバー
document.getElementById("maximumneet").innerHTML = maximumneet[0]; // 一日の接続時間が最も長かったメンバー



function datetostr(date, format, is12hours) {
  var weekday = ["日", "月", "火", "水", "木", "金", "土"];
  if (!format) {
      format = 'YYYY/MM/DD(WW) hh:mm:dd'
  }
  let year = date.getFullYear();
  let month = (date.getMonth() + 1);
  let day = date.getDate();
  weekday = weekday[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let secounds = date.getSeconds();

  let ampm = hours < 12 ? 'AM' : 'PM';
  if (is12hours) {
      hours = hours % 12;
      hours = (hours != 0) ? hours : 12; // 0時は12時と表示する
  }

  let replaceStrArray =
      {
          'YYYY': year,
          'Y': year,
          'MM': ('0' + (month)).slice(-2),
          'M': month,
          'DD': ('0' + (day)).slice(-2),
          'D': day,
          'WW': weekday,
          'hh': ('0' + hours).slice(-2),
          'h': hours,
          'mm': ('0' + minutes).slice(-2),
          'm': minutes,
          'ss': ('0' + secounds).slice(-2),
          's': secounds,
          'AP': ampm,
      };

  let replaceStr = '(' + Object.keys(replaceStrArray).join('|') + ')';
  let regex = new RegExp(replaceStr, 'g');

  let ret = format.replace(regex, function (str) {
      return replaceStrArray[str];
  });

  return ret;
}