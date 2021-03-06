**Middleware** used for advanced querying Mongoose Documents for a specific Model through GET request using the queries and parameters provided by the URL . **It only works with MongoDB (mongoose) and expressjs**. Furthermore, it includes **pagination**

## Why use this middleware?

**Benefits:**

1. Advanced query for specific field in mongoose model
2. Many available operators and operations that you can use just by passing them in the URL
3. Special operators like ?all and ?q that provide global advanced query/search through all fields in a mongoose model without worrying about what type is the field(Mongoose String, Mongoose ObjectId) or the query value(number, string, date)
4. Included Pagination

**Additional examples about this middleware**:
[HERE](https://github.com/Blagoj5/baze-packages/tree/main/advanced-results/MoreDocsAndExamples)

## Install

```
$ npm install advanced-results@latest
```

## Usage

**ES6 syntax**:

```
import advancedResults from 'advanced-results'
```

**ES5 syntax**:

```
const advancedResults = require('advanced-results');
```

### Basic usage

Advanced-results middleware is very easy to implement you just use it in the route right before your main controller/middleware:
Ex.

```
const app = express();

app.use('/posts', advancedResults(Model), (req, res) => {
  // The result for the advancedResults middleware is store inside res.advancedResults
  res.status(200).json({ success:true, data: res.advancedResults })
});
```

The **results and the chosen documents** are stored inside **res.advancedResults**. Ex num2.

```
const router = express.router();

router.get('/posts', advancedResults(Model), (req, res) => {
  // The result for the advancedResults middleware is store inside res.advancedResults
  res.status(200).json(res.advancedResults)
});
```

### How it works

This middleware works **thanks to the express request object** and uses req.query and req.params.

As a first argument **advancedResults(MODEL)**, accepts a **mongoose** model that will be the target for the advanced querying.

**Example scenario**:

1. Model

```
 const UserSchema = new mongoose.Schema({
    name: String,
    user: String,
    randomNum: Number,
  });

  const User = mongoose.model('User', UserSchema);

  await model.insertMany([
      { name: 'Tester', user: 'Tester', randomNum: 4 },
      { name: 'Tester2', user: 'Tester2', randomNum: 54 },
      { name: 'Tester3', user: 'Tester3', randomNum: 42 },
    ]);
```

2. Route:

```
  app.use(
    '/users',
    advancedResults(User),
    (req, res: any) => {
      res.status(200).json(res.advancedResults);
    }
  );
```

3. URLs:

```
  FOR URL: example.com?name=Tester

  OUTPUT: res.advancedResults = {
  success: true,
  count: 1,
  pagination: { pages: 1, total: 1, maxDocuments: 3, current: 1, limit: 6 },
  data: [
    {
      _id: 5fa47738c49e1327502760ca,
      name: 'Tester',
      user: 'Tester',
      randomNum: 4,
      __v: 0
    }
  ]
}
```

```
  FOR URL: example.com?name[regex]=Tester

  OUTPUT: res.advancedResults = {
  success: true,
  count: 3,
  pagination: { pages: 1, total: 3, maxDocuments: 3, current: 1, limit: 6 },
  data: [
    {
      _id: 5fa47738c49e1327502760ca,
      name: 'Tester',
      user: 'Tester',
      randomNum: 4,
      __v: 0
    },
    {
      _id: 5fa47738c49e1327502760cb,
      name: 'Tester2',
      user: 'Tester2',
      randomNum: 54,
      __v: 0
    },
    {
      _id: 5fa47738c49e1327502760cc,
      name: 'Tester3',
      user: 'Tester3',
      randomNum: 42,
      __v: 0
    }
  ]
}
```

```
  FOR URL: example.com?name[regex]=Tester&select=name

  OUTPUT: res.advancedResults = {
  success: true,
  count: 3,
  pagination: { pages: 1, total: 3, maxDocuments: 3, current: 1, limit: 6 },
  data: [
    { _id: 5fa47738c49e1327502760ca, name: 'Tester' },
    { _id: 5fa47738c49e1327502760cb, name: 'Tester2' },
    { _id: 5fa47738c49e1327502760cc, name: 'Tester3' }
  ]
}
```

URLs also work with some **special fields**: all, q and filter  
**Example 1**.

```
  FOR URL: example.com?all=42

  OUTPUT: res.advancedResults = {
  success: true,
  count: 1,
  pagination: { pages: 1, total: 1, maxDocuments: 3, current: 1, limit: 6 },
  data: [
    {
      _id: 5fa47738c49e1327502760cc,
      name: 'Tester3',
      user: 'Tester3',
      randomNum: 42,
      __v: 0
    }
  ]
}
```

**?all or ?q** fields are basically the same and they are used for searching trough all **paths** and **subpaths** of the provided **model**. For the query above where ?all=42 here's what was given to the **model.find()** function:

```
model.find({ '$or': [ { randomNum: 42 }, { __v: 42 } ] })
```

**Example 2** for ?all or ?q:

```
  FOR URL: example.com?all=test&select=name&sort=name

  QUERY PASSED TO MODEL(USER in our case):
  model.find("$or":[{"name":{"$regex":"test","$options":"i"}},{"user":{"$regex":"test","$options":"i"}}])

  OUTPUT: res.advancedResults = {
  success: true,
  count: 3,
  pagination: { pages: 1, total: 3, maxDocuments: 3, current: 1, limit: 6 },
  data: [
    { _id: 5fa47738c49e1327502760ca, name: 'Tester' },
    { _id: 5fa47738c49e1327502760cb, name: 'Tester2' },
    { _id: 5fa47738c49e1327502760cc, name: 'Tester3' }
  ]
}
```

**?filter** is a more complicated query parameter and requires more parsing before it's sent to the backend. I initially created this option because of **react-admin** package. You can find more example on how to use this [HERE](./MoreDocsAndExamples)

### Advance Usage

#### Additional parameters

advancedResults except model as first parameter it takes 3 more arguments

**advancedResults(Model, populateFieldOrFields: string | string[], parameter: [string, string], consoleLogIt: boolean)**

1. First parameter is the model that will be used by this middleware on a certain route
2. If in the model you have **ObjectId field** that can be populated you can pass that field as the **second argument** in this function and res.advancedResults will **return the matching documents with that populated field**.  
    **Example**. **advancedResults(User, 'blogs')** OR if you have **multiple fields** that you want to populate you do **advancedResults(User, ['blogs', 'books'])**  
   Examples that you can pass as second argument: - advancedResults(User, 'books') - advancedResults(User, ['books', 'blogs']) - advancedResults(User, [
   { path: 'books', select: 'title content' },
   { path: 'blogs', select: 'title content' }]) - It will populate books and blogs paths and select specific fields (in this case title and content for both ObjectIds)
3. The third argument is specific argument and is used to handle the case where we have a route that has parameter inside of it: example.com/posts/:userId. So the third argument ALWAYS is array with length of 2. The first element of that array is the **field NAME** and the second is the **parameter NAME**. **Example**.  
   If lets say model Post has an users field inside of it that is of type ObjectId you pass the ['users', 'userId] ---> it will create additional filter in this case if the parameter's userId = 1234567afd (example.com/posts/123456afd), object will be {users: 1234567afd}.  
   This can be used with additional query example.com/posts/123456afd?all=text&limit=2&page=3  
   **advancedResults(Post, null, ['user', 'userId'])**
4. The fourth argument is of type boolean and is only used for deciding whenever the middleware should console log what the final results of res.advancedResults will look like and what will be passed to model.find(). Default is: **fasle**  
   **advancedResults(Post, null, null, true)**

## Documentation

In this section I will mention most of the options you can pass to the URL that will work with this middleware

### Options

[**Check MongoDB**](https://docs.mongodb.com/manual/reference/operator/) documentation about querying, operators and options in order to understand more about this middleware. Here's a basic explanation for some of the options :

**NOTE**: Only the options specified bellow work for this middleware (if you want additional options please open up a issue so i can add them)

#### Field Specific Operators

1. Operators that you can pass to the URL without **\$** sign:

| Operator    | Description                                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **in**      | selects the documents where the value of a field equals any value in the specified array , ex. ?field[in]=value1,value2                                                                |
| **nin**     | selects the documents where the value of a field is different from any value in the specified array , ex. ?field[nin]=value1,value2                                                    |
| **regex**   | provides regular expression capabilities for pattern matching strings in queries. By default is in-case sensitive but can be changed by the \$options operator, ex. ?field[regex]=sth) |
| **options** | this only works with regex. By default is case-insensitivite ex. ?field[regex]=val&field[options]=i                                                                                    |
| **gt**      | example.com?field[gt]=5                                                                                                                                                                |
| **gte**     | example.com?field[gte]=5                                                                                                                                                               |
| **lt**      | example.com?field[lt]=5                                                                                                                                                                |
| **lte**     | example.com?field[lte]=5                                                                                                                                                               |
| **eq**      | example.com?field[eq]=5                                                                                                                                                                |
| **ne**      | example.com?field[ne]=5                                                                                                                                                                |

<br />

2. Other operators work however you need to pass $ for example, if you want to pass operator $ne. You need to do example.com?field[$ne]=value. All operators HERE: https://docs.mongodb.com/manual/reference/operator/. **IMPORTANT:** If you are using any mongo/express sanitizer library, adding or passing of $ne directly inside the URL MIGHT NOT work because of the sanitazation those middlewares do. However this middleware should work correctly for the options specified above without the dollar ($) sign.

#### Query operations

Special operations that can be done via URL:

| Operations       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **select**       | selects single or multiple fields from a document, example.com?select=field or multiple example.com?select=field1,field2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **sort**         | Default field: createdAt, example.com?sort=field. **Field can be ?sort=name (ASC Order) or ?sort=-name (DSC Order)** or **?sort=randomNum,-name** (sorting multiple fields)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **limit**        | **default: 6**, used for **limiting documents** affects pagination object inside res.advancedResults, example.com?limit=5                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **page**         | **default: 1**, the current page (if there are multiple pages), this goes together with ?limit, and depending on the ?page and ?limit values it calculates and displays the current pagination properties inside res.advancedResults, ex. example.com?page=2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **all** or **q** | used for searching trough all fields of provided model for a certain value provided in the URL, ex. example.com?all=value or multiple words example.com?all=value1+value2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **or**           | special property that handles the case if you want to do logical OR instead of the defaul AND in a query. Ex. example.com?name[regex]=Tester&randomNum=42 - **This will return only the documents where the randomNum is 42 and the name has Tester**, however with the new field if you specify example.com?name[regex]=Tester&randomNum=42&or=name,randomNum - **It will execute $or operation on those fields, in this case on randomNum and name, so this query will return all the documents where either the name is Tester or the random num is 42**. If you leave the **?or OR &or** query empty it will group all queries from the URL into a $or operator, ex. example.com?name=Tester&randomNum=42&randomField=something&or - all 3 fields will be inside $or operator, however if you specify &or=randomNum,name, the query will look {randomField: 'something', $or: {name: 'Tester, randomNum: 42}} |
| **filter**       | more complex than the other 2, it requires additional parsing before sending request to backend to work. Short explanation: filter is an object that first needs to be JSON.stringified then using library like query-parser, parsed INTO URL then sent to the backend. [Check this additional explanation for usage](https://github.com/Blagoj5/baze-packages/tree/main/advanced-results/MoreDocsAndExamples)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

#### Result: res.advancedResults explained in Details

Usually **res.advancedResults** is provided in the next form:

```
res.advancedResults = {
  success: true,
  count: 3,
  pagination: {
    pages: 3,
    total: 9,
    maxDocuments: 3,
    next: { nextPage: undefined, page: 2 },
    current: 1,
    limit: 1
  },
  data: [
    {
      _id: 5fa47738c49e1327502760ca,
      name: 'Tester',
      user: 'Tester',
      randomNum: 4,
      __v: 0
    },
    {
      _id: 5fa47738c49e1327502760cb,
      name: 'Tester2',
      user: 'Tester2',
      randomNum: 54,
      __v: 0
    },
    {
      _id: 5fa47738c49e1327502760cc,
      name: 'Tester3',
      user: 'Tester3',
      randomNum: 42,
      __v: 0
    }
  ]
}
```

- **count** - returns the number of documents currently in the data object. This is not the same as pagination.maxDocuments or pagination.total
- **pagination** - object depends on the ?page and ?limit. The **next** property gives the next page (if there's one) and the next next Page if it exists. If next.page exists, however next.nextPage doesn't it is set to undefined. Example if page = 1; next.page = 2; next.nextPage = 3 | undefiend. Same explanation is with the **prev** property of the pagination object
- **pagination.total** - the maximum number of documents with the QUERY
- **pagination.maxDocuments** - the maximum number of documents without the QUERY. **So this the total number of document from that model**
- **data** - The result of model.find(), a **list** of all documents that match the specific query criteria. If none it is empty

#### Additional explanation about ?all or ?q

If you have ?all=word1+word2 it does query for every field for word1 + for word2 + both words "word1 word2" and merges them together into a single object which is then passed to model.find()

#### What to do if you still don't understand how it works?

I would encourage you to install this middleware and enable the console log option which is the **fourth argument** and see what it returns and what will be taken into consideration when querying.

### Error handling

If this middleware throws an error it will automatically call next(new Error) which will then go to your error middleware handler. Check expressjs error handling page where it teaches you how to define error middleware to handle all types of error and return them into the res object back to the client

### Some cheat codes for the ones that made it to the end

Instead of manually adding let's say parameters to URL example: localhost?name=Tester1&select=name. You can do that with **stringified object**. **Here's how you do that**:

```
const query = {
    all: "Test",
    select: "name",
    page: "2"
}
```

Now you need to use **additional library like query-string** to stringify object to be transformed into valid URL parameters

```
const queryString = require('query-string');

const URL = `http://localhost:5000?${queryString.stringify(query)}`;

await axios.get(URL);
```

The query string transforms my URL variable to -> http://localhost:5005?all=Test&select=name&page=2 accordingly

[**CHECK THE ADDITIONAL DOCS FOR MANY MORE EXAMPLES AND EXPLANATION ON HOW TO USE THE ?filter PARAMETeR**](https://github.com/Blagoj5/baze-packages/tree/main/advanced-results/MoreDocsAndExamples)
