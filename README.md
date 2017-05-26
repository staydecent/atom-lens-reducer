# atom-lens-reducer

Provides `set`, `update`, `remove` actions and corresponding reducer.

```javascript
// Regardless of the value of `items` on our atom store, after this
// dispatch, it will equal our array passed as the second paramater.
dispatch(set('items', [
    {id: 1, title: 'cool'},
    {id: 2, title: 'neat'},
    {id: 3, title: 'rad'}
]))

// To merge, or update value, we can use update.
dispatch(update(['items', 0, 'title'], 'bunk'))
// result: `{items: [{id: 1, title: 'bunk'}, ...]`

// If we update a key that is an array, with another array, they are 
// concatenated:
dispatch(update('items', [{id: 4, title: 'appended!'}]))
// To keep things very simple, the existing array value is concatenated 
// with the new array value, so that the new array items are appended.
// To sort the combined array in some other way, we will rely on
// our accessors. (Working on a convenient way to define 'queries' on
// top of current state object.)

// This also works for objects:
dispatch(set('user', {name: 'Adrian'}))
// Then
dispatch(update('user', {age: 29}))
// state = {user: {name: 'Adrian', age: 29}, ...}

// Remove should be self-explanatory. Like, update, we can pass an array
// describing the path.
dispatch(remove(['items', 1]))
// Will remove the element at index 1 in the items array.
```

These actions, used with atom or another Redux-like store, provide a simple way to describe mutations on your state object while maintaining uni-directional dataflow.

Under the hood, the heavy lifting is done by the indispensable [Ramda](http://ramdajs.com) library.