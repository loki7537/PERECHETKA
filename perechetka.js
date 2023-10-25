const peresadka = [
    "0,5х0,5х0,4",
    "0,8х0,8х0,6",
    "1,0х1,0х0,6",
    "1,3х1,3х0,6",
    "1,5х1,5х0,65",
    "1,5х1,5х0,65",
    "1,7х1,7х0,65",
    "2,0х2,0х0,8",
    "2,4х2,4х0,95"
     ];

const virubka = [
    "охр. зона ком.",
    "аварийное",
    "сухостой",
    "неудовлетв.",
    "поросль",
    "самосев",
    "5-ти м зона",
    "удовлетв.",
    "усыхающее"
]

const not_virubka = [
    "обрезка ветвей",
    "кронировать"
]

const tree = [
    "Акация белая",
    "Бархат амурский",
    "Береза",
    "Боярышник",
    "Вишня",
    "Вяз",
    "Груша",
    "Дуб",
    "Ель",
    "Ива",
    "Ива белая",
    "Каштан",
    "Клен",
    "Клен ясенелистный",
    "Лжетсуга",
    "Липа",
    "Лиственница",
    "Ольха",
    "Орех",
    "Осина",
    "Остолоп",
    "Пихта",
    "Плодовое",
    "Рябина",
    "Саженцы",
    "Самосев до 8 см.",
    "Слива",
    "Сосна",
    "Сухостой",
    "Тополь",
    "Тополь белый",
    "Тополь пирамидальный",
    "Травяной покров",
    "Туя",
    "Черемуха",
    "Экзот",
    "Яблоня",
    "Ясень" 
  ]

//=========================================//
//  добавляет новый метод для массива      //
//  сравнение без учета регистра           //
//=========================================//
Array.prototype.includesCase = function(str)
{
    //выводит слово как в массиве
   //return this.filter(i => i.toLowerCase() == str.toLowerCase())[0]

    //выводит true, если есть такое слово или false, если такого слова нет
    if (this.filter(i => i.toLowerCase() == str.toLowerCase()).length > 0)
    {
        return true
    }
    else
    {
        return false
    }
}


//peresadka.includes("dog"); 

function modifyText() {
    var reader = new FileReader();
    
    np = document.getElementById('my_input');
    reader.onload = function() {
        var raw_data;
        var arrayBuffer = this.result,
            array = new Uint8Array(arrayBuffer),
//--------------------------------------------------------------------------
//если прочитать сразу, String.fromCharCode.apply то в некоторых браузерах вызывает переполнение памяти
//---------------------------------------------------------------------------
            binaryString = arrayBufferToString(array);
//---------------------------------------------------------------------------
        /* Вызываем XLSX */
        var workbook = XLSX.read(binaryString, {
            type: 'binary'
        });

        /* DO SOMETHING WITH workbook HERE */
        var first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];
        // вывод в массив
        raw_data = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        if(verification_worksheet(raw_data))
        {
            extraction_data(raw_data); // удаляет лишние строки из массива
            //error_Table(raw_data);     // таблица с ошибками
            
            error_Table(raw_data);    // добавляет столбец с ошибками к таблице
            append_Table(raw_data); // добавляет таблицу в документ

        }
        else
        {
          append_Table_Zerro();
        }
        
   
    }
    
    reader.readAsArrayBuffer(np.files[0]);
        
}

//===========================================//
//  проверяет что файл является перечеткой   //
//===========================================//
function verification_worksheet (wrch)
{
    if (wrch[0][12] === "формат")
    {
        return true;
    }
      else
      {
        return false;
      }

}

//======================================//
//   удаляет лишние строки из массива   //
//======================================//
function extraction_data (arrays)
{
    
    for (let i = arrays.length - 1; i >= 0; --i) 
    {   
        arrays[i].splice(11); //удалит столбцы с 11 и до конца
        //arrays[i].splice(5, 1); //удалит столбцы с 11 и до конца

        if (arrays[i][1]=='Итого:')
        {
            arrays.splice(i);//удаляет все строки начиная со строки с "итого"
        }
        else if (i<7 || 
            (arrays[i][0]==undefined 
            && arrays[i][1]==undefined
            && arrays[i][2]==undefined
            && arrays[i][3]==undefined
            && arrays[i][4]==undefined
            && arrays[i][6]==undefined
            && arrays[i][7]==undefined
            && arrays[i][8]==undefined
            && arrays[i][10]==undefined))//удаляет первые семь строчек или пустые строки
        {
            arrays.splice(i, 1);
        }
    }
}

//==================================//
//     создает таблицу из массива   //
//==================================//
function arraysToTable(arrays, id) {
    const table = document.createElement('table');
    table.id = id;
    table.className = "table_my";
    // если ошибок нет, выводим одну строку с надписью
    if (arrays.length == 0)
    {
        const tr = table.insertRow();
        const td = tr.insertCell();
        td.setAttribute("style", "color: blue");
        td.textContent = "В перечетной ведомости известных ошибок не найдено";

    }
    else // если ошибки есть
    {    
    for (const row of arrays) 
    {
      const tr = table.insertRow();
      for (const cells of row)
       {
        const td = tr.insertCell();
        td.textContent = cells;
        if (td.cellIndex == 11)
        {
            td.setAttribute("style", "color: red");
        }
       }
    }
    // создаем заголовок таблицы
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    var cell6 = row.insertCell(6);
    var cell7 = row.insertCell(7);
    var cell8 = row.insertCell(8);
    var cell9 = row.insertCell(9);
    var cell10 = row.insertCell(10);
    var cell11 = row.insertCell(11);
    cell0.innerHTML = "<b>№</b>";
    cell0.setAttribute("style", "width: 41px");
    cell1.innerHTML = "<b>Порода</b>";
    cell1.setAttribute("style", "width: 180px");
    cell2.innerHTML = "<b>Дер.</b>";
    cell2.setAttribute("style", "width: 47px");
    cell3.innerHTML = "<b>Куст.</b>";
    cell3.setAttribute("style", "width: 52px");
    cell4.innerHTML = "<b>D</b>";
    cell4.setAttribute("style", "width: 68px");
    cell5.innerHTML = "<b>A</b>";
    cell5.setAttribute("style", "width: 22px");
    cell6.innerHTML = "<b>H</b>";
    cell6.setAttribute("style", "width: 48px");
    cell7.innerHTML = "<b>Характеристика</b>";
    cell7.setAttribute("style", "width: 190px");
    cell8.innerHTML = "<b>Заключение</b>";
    cell8.setAttribute("style", "width: 118px");
    cell9.innerHTML = "<b>Стоимость</b>";
    cell9.setAttribute("style", "width: 110px");
    cell10.innerHTML = "<b>Примечание</b>";
    cell10.setAttribute("style", "width: 120px");
    cell11.innerHTML = "<b>Ошибки</b>";
   // cell11.setAttribute("style", "width: 108px");

    }

    return table;
}
//==================================//
//   добавляет таблицу в документ   //
//==================================//
function append_Table(my_array)
{
  if (document.getElementById('my_table'))
     {
      document.getElementById('my_table').remove();
     }
  document.getElementById('my_body').appendChild(arraysToTable(my_array, 'my_table')); 

  //document.body.appendChild(arraysToTable(my_array, 'my_table'));
}

//=================================//
// добавляет строку с информацией  //
// если файл не перечетка          //
//=================================//
function append_Table_Zerro() 
{       const table = document.createElement('table');
        table.id = "my_table";
        table.className = "table_my";

        const tr = table.insertRow();
        const td = tr.insertCell();
        td.setAttribute("style", "color: red");
        td.textContent = "Файл не является перечеткой";
        if (document.getElementById('my_table'))
        {
           document.getElementById('my_table').remove();
        }
       document.getElementById('my_body').appendChild(table);
}


//==================================//
//        проверка значений         //
//==================================//
function error_Table(arrays)
{   const error_array = new Array;
    for (let i = arrays.length - 1; i >= 0; --i) 
    {   
        if (Number.isFinite(arrays[i][9]))
        {
            arrays[i][9]=(arrays[i][9].toFixed(1))
        }
        if (
            arrays[i][0]==undefined
           )            
        {
            error_array.unshift(["", "Не заполнен номер"]);// если делать отдельную таблицу
            arrays[i].push("Не заполнен номер"); //если добавлять в таблицу с перечеткой
        }
        else if (
            arrays[i][1]==undefined ||
            (arrays[i][2]==undefined && arrays[i][3]==undefined) ||
            (tree.includesCase( arrays[i][1] ) == true && arrays[i][4]== undefined)|| //если дерево, то должен быть диаметр
            arrays[i][6]==undefined ||
            arrays[i][7]==undefined ||
            arrays[i][8]==undefined ||
            arrays[i][10]==undefined
            )
        
        {
            error_array.unshift([arrays[i][0], "Не все поля заполнены"]);//
            arrays[i].push("Не все поля заполнены"); //если добавлять в таблицу с перечеткой
        }

        else if(
            tree.includesCase( arrays[i][1] ) == false && arrays[i][4]!=undefined
           )            
        {
           // error_array.unshift([arrays[i][0], "указан диаметр для кустарников"]);//
            arrays[i].push("указан диаметр для кустарников"); //если добавлять в таблицу с перечеткой
        }


        else if(
            arrays[i][8]=="Вырубить" && arrays[i][1]=="поросль" && arrays[i][10] != "поросль"
           )            
        {
            error_array.unshift([arrays[i][0], "В столбце 'Примечание' не поросль"]);//
            arrays[i].push("В столбце 'Примечание' не поросль"); //если добавлять в таблицу с перечеткой

        }
        else if(
            arrays[i][8]=="Вырубить" && arrays[i][1]=="Самосев до 8 см." && arrays[i][10] != "самосев"
           )            
        {
            error_array.unshift([arrays[i][0], "В столбце 'Примечание' не самосев"]);//
            arrays[i].push("В столбце 'Примечание' не самосев"); //если добавлять в таблицу с перечеткой
        }
        else if(
            arrays[i][8]=="Вырубить" && arrays[i][1]=="Саженцы"
           )            
        {
            error_array.unshift([arrays[i][0], "Саженцы вырубать нельзя"]);//
            arrays[i].push("Саженцы вырубать нельзя"); 

        }
        else if(
            arrays[i][1]=="Сухостой" && arrays[i][8] !="Вырубить"
           )            
        {
            error_array.unshift([arrays[i][0], "Сухостой рубить обязательно"]);//
            arrays[i].push("Сухостой рубить обязательно"); 
        }
        else if(
            arrays[i][8]=="Вырубить" && arrays[i][1]=="Сухостой" && arrays[i][10] != "сухостой"
           )            
        {
            error_array.unshift([arrays[i][0], "В столбце 'Примечание' не сухостой"]);//
            arrays[i].push("В столбце 'Примечание' не сухостой"); 
        }
        else if(
            arrays[i][8]=="Пересадить" && !peresadka.includes(arrays[i][10]) //!peresadka.indexOf( arrays[i][10] ) != -1  
           )            
        {
            error_array.unshift([arrays[i][0], "Неправильно указан размер кома при пересадке"]);//
            arrays[i].push("Неправильно указан размер кома при пересадке"); 

        }
        else if(
            arrays[i][2]!=undefined && !(tree.includesCase( arrays[i][1] ) == true)  
           )            
        {
            error_array.unshift([arrays[i][0], "данные о количестве не в том столбце"]);//
            arrays[i].push("Данные о количестве не в том столбце"); 
        }
        else if(
            arrays[i][3]!=undefined && (tree.includesCase( arrays[i][1] ) == true)  
           )            
        {
            error_array.unshift([arrays[i][0], "данные о количестве не в том столбце"]);//
            arrays[i].push("Данные о количестве не в том столбце"); 
        }
        else
        {
            arrays.splice(i, 1); //удаляет строку, если она без ошибок
        }


    }
    console.log(arrays);
    return error_array;

}


//======================================//
//    читает буферы постепенно,         //
//    иначе переполнение памяти         //
//======================================//
function arrayBufferToString(buffer){

    var bufView = new Uint16Array(buffer);
    var length = bufView.length;
    var result = '';
    var addition = Math.pow(2,16)-1;

    for(var i = 0;i<length;i+=addition){

        if(i + addition > length){
            addition = length - i;
        }
        result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
    }

    return result;

}



//выбираем кнопку
const button=document.getElementById('my_button');
//вешаем на нажатие кнопки вызов функции
button.addEventListener('click', modifyText);



