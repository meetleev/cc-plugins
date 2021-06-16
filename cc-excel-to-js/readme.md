# cc-excel-to-js Excel表格格式需求
* 第一行为备注，第二行为配置表中的key，第三行为列的类型
* 第一列必须为表的索引，列名id， 类型int
* 列数据类型支持string/str、int、float/double、array/arr, arr单个元素不支持string，元素之间用逗号隔开
## For example

id | 名字 | 年龄 | 分数
:-|:-|:-|:-|
id|name|age|scores
int|str|int|arr
0|github|20|80,70,90
1|git|15|60,70,80

## 生成结果如下

```ts
/* student.ts
* @field index -> id
* @field name -> 名字
* @field age -> 年龄
* @field sorces -> 分数
*/
export default  {
 [0]: { name: "github", age: 20, sorces: [80,70,90]},
 [1]: { name: "git", age: 15, sorces: [60,70,80]}
};


/*  DBMacros.ts
* Created by Lee on 2021-06.
*/
import student from './Template/student';

// @ts-ignore
let pstudentArr = null;
// @ts-ignore
function DB_ARRAY(_DATA_, _ARRAY_){ if (null == _ARRAY_) {let keys = Object.keys(_DATA_);_ARRAY_ = [];for(let k of keys) {let v = _DATA_[k];v.id = parseInt(k);_ARRAY_.push(v);}}return _ARRAY_;}
// @ts-ignore
function DB_STUDENT_ITEM(_ID_ = 0) {let item = student[_ID_];if(item) item.id = item.id || _ID_;return item;}
// @ts-ignore
function DB_STUDENT_ARRAY(){ return DB_ARRAY(student, pstudentArr);}


export  {DB_STUDENT_ITEM, DB_STUDENT_ARRAY, }

```

## Usage
  **将所需插件拷贝到project/packages目录下**

## Requirement
  **CocosCreator 3.x**