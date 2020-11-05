# cc-excel-to-js Excel表格格式需求
* 第一行为备注，第二行为配置表中的key，第三行为列的类型
* 第一列必须为表的索引，列名id， 类型int
* 列数据类型支持string/str、int、float/double、array/arr, arr单个元素不支持string，元素之间用逗号隔开
## for example

id | 名字 | 年龄
:-|:-|:-|
id|name|age
int|str|int
0|github|20
1|git|15


## Usage
  **将所需插件拷贝到project/packages目录下**
