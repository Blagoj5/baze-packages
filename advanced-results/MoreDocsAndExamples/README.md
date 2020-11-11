We are going to explain this page trough examples again.
Let's say we have **model User** which looks like:

```
 const UserSchema = new mongoose.Schema({
    name: String,
    user: String,
    randomNum: Number,
  });

  const User = mongoose.model('User', UserSchema);
```

And let's fill that model with some documents:

```

  await model.insertMany([
      { name: 'Tester', user: 'Tester', randomNum: 4 },
      { name: 'Tester2', user: 'Tester2', randomNum: 54 },
      { name: 'Tester3', user: 'Tester3', randomNum: 42 },
    ]);

```

## Content

- Explanation for ?filter parametar
- More examples (demonstrating usage of this middleware)

## Explanation for filter url parametar

### Why the need to add ?filter when you already have ?q and ?all parametar?

First to clarify this parametar is **extra**. I only created it because i implemented react-admin in my project from where i send the whole query data in ?filter='{"something":"something"}'

### How to use it

Now since i already have it in my project it would be a waste not to teach you how to use it.

Let's say we want to fetch a user whose name is Tester2:

```
const userFilter = {
    name: "Tester2"
}
```

Now since i need to send this **OBJECT** trough a url parametar first i need to stringify it. I do this with:

```
const filterString = JSON.stringify(userFilter);
//OUTPUTS: '{"name":"Tester2"}'
```

Second step is to use http library like axios

```
const url = 'localhost:5005' + `?filter=${filterString}`;

const data = axios.get(url);

// The data i will get for this specific scenario with the above inserted documents in model User
// OUTPUT: data.data = {
  success: true,
  count: 1,
  pagination: { pages: 1, total: 1, maxDocuments: 15, current: 1, limit: 6 },
  data: [
    {
      _id: '5fa47738c49e1327502760cb',
      name: 'Tester2',
      user: 'Tester2',
      randomNum: 54,
      __v: 0
    }
  ]
}
```

### Another way that you can use the ?filter parametar

You can use filter with the special options like **select, limit, page,sort**

1. The normal way you add stringified filter parametar to url and you add &select=name next to it.  
   **Example**. http://localhost:5005?filter={"name":"Tester2"}&select=name
2. Creating global object where you will store the filter field and all the special options. Here's the example:

```
const query = {
    filter: JSON.stringify({
        name: "Tester2"
    }),
    select: "name",
    page: "2"
}
```

Now you need to use **additional library like query-string** to stringify object to be transformed into valid url parametars

```
const queryString = require('query-string');

const url = `http://localhost:5000?${queryString.stringify(query)}`;

await axios.get(url);
```

The query string transforms my url variable to -> \*\*\*\*http://localhost:5005?filter={"name":"Tester2"}&select=name&page=2 accordingly

### Conclusion

So with this we found out that ?name=Tester **is same with** ?filter={"name":"Tester2"}

## More examples

As a domain **localhost** will be used  
This examples will cover up on how the urls can be composed when sending to end point that uses this middleware:

1. Example:

```
url: localhost?name=Test&select=name

// Explanation: This will make the middleware find documents that name contains "test" and only select the name field from the provided model

// Additional explanation: In other words if model provided is User ----> User.find({name: {$regex: 'test', $options: 'i'}}) and Model.select(name)
```

2. Example:

```
url: localhost?name=Test&sort=name // ASC ORDER
url: localhost?name=Test&sort=-name // DSC ORDER

// Explanation: This will make the middleware find documents that name contains "test" and only sort by the name field from the provided model

// Additional explanation: In other words if model provided is User ----> User.find({name: {$regex: 'test', $options: 'i'}}) and Model.sort(name)
```

**IS SAME AS (second way of composing the url string)**:

```
const query = {
    name: "Tester",
    select: "name",
}
```

Now you need to use **additional library like query-string** to stringify object to be transformed into valid url parametars

```
const queryString = require('query-string');

const url = `http://localhost?${queryString.stringify(query)}`;

await axios.get(url);
```

The query string transforms my url variable to -> http://localhost?name=Tester&select=name accordingly

3. Example:

```
url: localhost?all=Test // ASC ORDER

// Explanation: This will make the middleware find documents that checks if any of the fields contains "test" and if only one field contains test returns that document in the array. Which is res.advancedResults

// Additional explanation:
```

4. Example:

```
url: localhost?name[in]=test,tester1,Tester

// Explanation: This will make the middleware find documents where the name field contains atleast one of "test", "tester1", "Tester" and add that document to the array which is res.advancedResults.

// Additional explanation:
```

5. Example:

```
url: localhost?randomNum[gt]=5

// Explanation: This will make the middleware find documents where the randomNum field value is greater then 5 and add that document to the array which is res.advancedResults.

// Additional explanation:
```
