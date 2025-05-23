const ReturnDate = () => {
  var yearMonth = document.getElementsByClassName("fc-toolbar-title")[0]?.textContent;
    console.log(yearMonth);
    //年の前の文字列を切り取ることで年を取得
    var year = yearMonth.substr(0, yearMonth.indexOf('年'));
    //年以降の文字列を切り取ることで月を取得
    var month = yearMonth.substr(yearMonth.indexOf('年') + 1);
    //月の文字列が残るため削除
    month = month.substr(0,month.indexOf('月'));
    console.log('aaaa');
    console.log(year,month);

}
export default ReturnDate;