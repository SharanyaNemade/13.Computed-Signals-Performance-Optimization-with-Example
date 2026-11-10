# Angular21


# Computed Signals in Angular 21 – Complete Guide

Computed Signals are one of the most important concepts in Angular's Signals API. They help developers create derived state, automatically track dependencies, avoid unnecessary calculations, and improve application performance.

Let's understand computed signals from the basics to advanced concepts, with practical examples and Angular interview questions.

## 1. What are Signals in Angular?

Signals are a reactive way to manage and track state in Angular.

A signal is a wrapper around a value. Whenever its value changes, Angular knows which parts of the application depend on that value.

Example:

typescript

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h2>Count: {{ count() }}</h2>
    <button (click)="increment()">Increment</button>
  `
})
export class AppComponent {

  count = signal(10);

  increment() {
    this.count.update(value => value + 1);
  }
}
```

Here:

- `signal(10)` creates a writable signal.
- `count()` reads the signal's value.
- `set()` replaces its value.
- `update()` updates its value based on the previous value.

Angular provides different types of signals, including writable signals and computed signals.

## 2. What are Computed Signals?

A computed signal is a read-only signal whose value is automatically calculated from other signals.

In simple words:

- A normal signal stores data.
- A computed signal derives data from other signals.
- When the dependent signals change, the computed signal automatically recalculates when its value is next needed.

Syntax:

typescript

```typescript
import { signal, computed } from '@angular/core';

count = signal(10);

doubleCount = computed(() => this.count() * 2);
```

Here:

- `count` is a writable signal.
- `doubleCount` is a computed signal.
- `doubleCount` depends on `count`.

If `count` changes from 10 to 20, `doubleCount` automatically becomes 40 when read.

You don't need to manually update `doubleCount`.

## 3. Why are Computed Signals Needed?

Imagine you have an application where you need to calculate:

- Product price
- GST amount
- Total price
- Discount
- Final payable amount

Without computed signals, you might manually calculate and update each value whenever the original data changes.

This creates unnecessary code and increases the possibility of bugs.

With computed signals, Angular handles derived values automatically.

Without computed signals:

typescript

```typescript
price = signal(1000);
quantity = signal(2);

total = signal(2000);

updateTotal() {
  this.total.set(this.price() * this.quantity());
}
```

Problem: Every time price or quantity changes, you must remember to call `updateTotal()`.

With computed signals:

typescript

```typescript
price = signal(1000);
quantity = signal(2);

total = computed(() => {
  return this.price() * this.quantity();
});
```

Now:

- Change price → total updates automatically.
- Change quantity → total updates automatically.
- No manual synchronization is required.

Main reason: Computed signals eliminate manually maintaining derived state.

## 4. Difference Between Normal Signal and Computed Signal

| Feature | Normal Signal | Computed Signal |
| --- | --- | --- |
| Purpose | Stores data | Derives data |
| Creation | `signal()` | `computed()` |
| Writable | Yes | No |
| Uses `set()` | Yes | No |
| Uses `update()` | Yes | No |
| Dependencies | Can be read by other signals | Automatically tracks signals it reads |
| Recalculation | Value changes when explicitly updated | Recalculates when invalidated and next read |
| Caching | Stores current value | Memoizes calculated value |

Example:

typescript

```typescript
import { signal, computed } from '@angular/core';

count = signal(10);

doubleCount = computed(() => this.count() * 2);

// Update normal signal
this.count.set(20);

// Read computed signal
console.log(this.doubleCount()); // 40
```

Important interview point:

A computed signal is read-only, but it is reactive. A normal signal is writable and can be used as a source of data.

## 5. Difference Between Normal Properties and Computed Signals

This is a very important interview question.

Consider a normal TypeScript property:

typescript

```typescript
height = 10;
width = 20;

area = this.height * this.width;
```

Initially:

text

```text
Height = 10
Width  = 20
Area   = 200
```

Now change the height:

typescript

```typescript
this.height = 15;
```

What happens?

text

```text
Height = 15
Width  = 20
Area   = 200
```

The area remains 200 because JavaScript doesn't automatically recalculate the `area` property when its dependencies change.

You must manually recalculate it:

typescript

```typescript
this.height = 15;
this.area = this.height * this.width;
```

Now let's use computed signals.

typescript

```typescript
height = signal(10);
width = signal(20);

area = computed(() => this.height() * this.width());
```

Change the height:

typescript

```typescript
this.height.set(15);
```

Now:

text

```text
Height = 15
Width  = 20
Area   = 300
```

No manual calculation is required.

### Comparison

| Feature | Normal Property | Computed Signal |
| --- | --- | --- |
| Declaration | `area = 200` | `area = computed(...)` |
| Automatic dependency tracking | No | Yes |
| Automatic derived value updates | No | Yes |
| Caching | No automatic memoization | Yes |
| Reactive with Angular templates | Not by itself | Yes |
| Can be manually assigned | Yes | No |
| Dependency management | Developer manages it | Angular manages it |

Important: A normal property can be updated through other mechanisms, such as change detection, observables or manual assignments. But a plain property does not provide automatic signal dependency tracking.

## 6. Real-World Example: Height, Width and Area

Let's build a practical Angular 21 component.

Requirement:

- User enters height.
- User enters width.
- Area should calculate automatically.
- Whenever height or width changes, area should update.

## Rectangle area calculator

Live example of writable and computed signals

Height

10

Width

20

Height# 10

Width# 20

Calculated area# 200

Square units

Change either input to see the derived area update.

### Angular 21 implementation

app.component.ts

typescript

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {

  // Writable signals
  height = signal(10);
  width = signal(20);

  // Computed signal
  area = computed(() => {
    return this.height() * this.width();
  });

  updateHeight(event: Event) {
    const value = Number(
      (event.target as HTMLInputElement).value
    );

    this.height.set(value);
  }

  updateWidth(event: Event) {
    const value = Number(
      (event.target as HTMLInputElement).value
    );

    this.width.set(value);
  }
}
```

app.component.html

HTMLWrap linesCopy codePreview

```html
<h2>Rectangle Area Calculator</h2>

<label>Height:</label>
<input
  type="number"
  [value]="height()"
  (input)="updateHeight($event)"
/>

<label>Width:</label>
<input
  type="number"
  [value]="width()"
  (input)="updateWidth($event)"
/>

<h3>Height: {{ height() }}</h3>
<h3>Width: {{ width() }}</h3>

<h2>Area: {{ area() }}</h2>
```

### How does it work internally?

Let's understand the execution step by step.

## Signal dependency flow

Height

# 10

Writable signal

Width

# 20

Writable signal

Both signals are dependencies

Area = computed()

# 200

Read-only derived signal

Angular template

Displays area()

Suppose the user changes height from 10 to 15.

1. `height.set(15)` updates the writable signal.
2. Angular knows that `area` depends on `height`.
3. Angular marks the computed value as potentially stale.
4. When `area()` is next read, Angular recalculates it.
5. The new result is 15 × 20 = 300.
6. The template reflects the updated value.

Notice something important: Angular does not necessarily execute the calculation immediately when the source signal changes. Computed signals are lazy.

## 7. How Computed Signals Automatically Update Based on Dependencies

Angular uses automatic dependency tracking.

Consider:

typescript

```typescript
price = signal(1000);
quantity = signal(2);
discount = signal(100);

total = computed(() => {
  return this.price() * this.quantity()
         - this.discount();
});
```

Dependency relationship:

Price

1000

Quantity

2

Discount

100

Total = computed()

# 1900

When any dependency changes, Angular invalidates the computed value.

For example:

typescript

```typescript
this.price.set(2000);
```

On the next read:

typescript

```typescript
console.log(this.total()); // 3900
```

### Important concept: Lazy evaluation and memoization

Computed signals have two important characteristics.

1. Lazy evaluation

The computation does not run until the computed signal is first read.

2. Memoization

After calculating the value, Angular caches the result.

Repeated reads return the cached value until a dependency change invalidates it.

Example:

typescript

```typescript
count = signal(10);

doubleCount = computed(() => {
  console.log('Calculation executed');

  return this.count() * 2;
});
```

typescript

```typescript
console.log(this.doubleCount());
console.log(this.doubleCount());
console.log(this.doubleCount());
```

Output:

text

```text
Calculation executed
20
20
20
```

The calculation executes once, not three times.

If `count` changes, the cached result becomes invalid. The next read recalculates it.

This is why computed signals are useful for expensive derived calculations.

Angular

+1

## 8. Common Mistakes Developers Make with Computed Signals

### Mistake 1: Trying to update a computed signal directly

Incorrect:

typescript

```typescript
count = signal(10);

doubleCount = computed(() => this.count() * 2);

this.doubleCount.set(50);
```

Why is this wrong?

Because computed signals are read-only.

Correct:

typescript

```typescript
this.count.set(25);
```

The computed value becomes 50 on its next read.

### Mistake 2: Forgetting parentheses while reading signals

Incorrect:

typescript

```typescript
area = computed(() => this.height * this.width);
```

Correct:

typescript

```typescript
area = computed(() => this.height() * this.width());
```

Calling the signal getter is what allows Angular to track the dependency.

### Mistake 3: Using normal properties inside computed

Incorrect:

typescript

```typescript
height = 10;
width = 20;

area = computed(() => this.height * this.width);
```

Why?

Height and width are ordinary properties. Angular cannot automatically track changes to them as signal dependencies.

Correct:

typescript

```typescript
height = signal(10);
width = signal(20);

area = computed(() => this.height() * this.width());
```

### Mistake 4: Using effect instead of computed

Unnecessary approach:

typescript

```typescript
price = signal(1000);
quantity = signal(2);
total = signal(0);

constructor() {
  effect(() => {
    this.total.set(
      this.price() * this.quantity()
    );
  });
}
```

Better approach:

typescript

```typescript
price = signal(1000);
quantity = signal(2);

total = computed(() =>
  this.price() * this.quantity()
);
```

Why?

Computed is designed for derived state. Effects are primarily for synchronizing signal changes with imperative, non-signal APIs and other side effects.

### Mistake 5: Mutating objects directly

Incorrect:

typescript

```typescript
user = signal({
  name: 'John',
  age: 25
});

this.user().age = 30;
```

This mutates the existing object without updating the signal.

Correct:

typescript

```typescript
this.user.update(user => ({
  ...user,
  age: 30
}));
```

### Mistake 6: Expecting computed to execute immediately

Incorrect assumption:

typescript

```typescript
count.set(20);

// Assuming the computed calculation
// has already executed here.
```

Computed values are lazy. They are recalculated when needed, not necessarily at the moment the dependency changes.

### Mistake 7: Performing API calls inside computed

Avoid:

typescript

```typescript
userData = computed(() => {
  // Don't perform an API request here.
  return this.http.get('/api/users');
});
```

Computed should be pure synchronous derivation logic.

For asynchronous data, use appropriate APIs such as `resource`, `rxResource`, or RxJS, depending on the use case.

## 9. How Computed Signals Improve Angular Performance

Computed signals improve performance in several ways.

### 1. Avoid unnecessary calculations

Suppose you have:

typescript

```typescript
products = signal([
  { name: 'Laptop', price: 50000 },
  { name: 'Mobile', price: 20000 },
  { name: 'Tablet', price: 15000 }
]);

totalPrice = computed(() =>
  this.products().reduce(
    (total, product) => total + product.price,
    0
  )
);
```

Angular calculates the total when required and caches the result.

It doesn't repeat the calculation every time `totalPrice()` is read.

### 2. Automatic dependency tracking

Angular knows exactly which signals a computed value depends on.

For example:

typescript

```typescript
firstName = signal('John');
lastName = signal('Smith');

fullName = computed(() =>
  `${this.firstName()} ${this.lastName()}`
);
```

If `firstName` changes, `fullName` becomes invalid.

An unrelated signal changing does not invalidate `fullName`.

### 3. Dynamic dependency tracking

This is an important advanced feature.

typescript

```typescript
showDetails = signal(false);
price = signal(1000);
quantity = signal(2);

displayValue = computed(() => {
  if (this.showDetails()) {
    return this.price() * this.quantity();
  }

  return 0;
});
```

When `showDetails` is false:

- Angular tracks `showDetails`.
- Angular does not track `price` or `quantity` through this computation.

When `showDetails` becomes true:

- Angular reevaluates the computation.
- It now tracks `price` and `quantity` as well.

Dependencies can change dynamically based on which signals are actually read.

### 4. Avoid duplicate derived state

Without computed:

typescript

```typescript
price = signal(1000);
quantity = signal(2);
total = signal(2000);
```

You must keep all three values synchronized.

With computed:

typescript

```typescript
price = signal(1000);
quantity = signal(2);

total = computed(() =>
  this.price() * this.quantity()
);
```

There is only one source of truth for each input.

### 5. Equality checking can avoid unnecessary downstream work

Angular also supports custom equality functions for computed signals.

Example:

typescript

```typescript
count = signal(2);

isEven = computed(
  () => this.count() % 2 === 0
);
```

Consider:

typescript

```typescript
this.count.set(4);
```

The computed value remains `true`.

Angular can recognize that the derived value has not semantically changed and avoid triggering downstream consumers unnecessarily.

Interview point: Computed signals use lazy evaluation, memoization, dependency tracking and equality checking to reduce unnecessary work. They help performance, but they do not automatically make every Angular application faster.

Angular

+1

## 10. Important Angular Interview Questions on Computed Signals

Here are 15 questions you should prepare for Angular interviews.

### Basic-level questions

Q1. What is a computed signal in Angular?

A computed signal is a read-only reactive value derived from one or more existing signals.

Q2. How do you create a computed signal?

Using the `computed()` function from `@angular/core`.

typescript

```typescript
double = computed(() => this.count() * 2);
```

Q3. Can we update a computed signal using set()?

No. Computed signals are read-only.

Q4. What is the difference between signal() and computed()?

- `signal()` creates writable state.
- `computed()` creates read-only derived state.

Q5. Do computed signals automatically track dependencies?

Yes. Angular automatically tracks the signals read inside the computed function.

### Intermediate-level questions

Q6. What is lazy evaluation in computed signals?

The computed function executes only when its value is needed.

Q7. What is memoization?

Memoization means caching a previously calculated result and reusing it until its dependencies change.

Q8. Can one computed signal depend on another computed signal?

Yes.

typescript

```typescript
price = signal(1000);
quantity = signal(2);

total = computed(() =>
  this.price() * this.quantity()
);

gst = computed(() =>
  this.total() * 0.18
);
```

Q9. Can computed signals depend on multiple signals?

Yes. Angular tracks all signals read during the computation.

Q10. Can computed dependencies change dynamically?

Yes. Angular tracks only the signals read during the latest execution of the computed function.

### Advanced-level questions

Q11. What happens when a dependency of a computed signal changes?

Angular invalidates the computed value. When it is next read, Angular recalculates it and caches the result.

Q12. Can we perform API calls inside computed signals?

No. Computed signals should contain pure synchronous derivations. Use resource APIs or RxJS for asynchronous operations.

Q13. What is the difference between computed() and effect()?

| Computed | Effect |
| --- | --- |
| Derives values | Performs side effects |
| Returns a signal | Does not return a derived signal |
| Read-only | Used for imperative operations |
| Lazy evaluation | Runs at least once and subsequently when dependencies change |
| Prefer for derived state | Prefer for non-signal synchronization |

Q14. Does computed improve Angular change detection performance?

It can reduce unnecessary recalculations and downstream updates. Signal-based dependency tracking also helps Angular identify which consumers need updating.

Q15. What happens if a computed signal does not read any other signals?

It has no reactive signal dependencies. Its result is still lazily evaluated and memoized, but it won't automatically recalculate due to signal changes.

## 11. Quick Revision: Important Concepts

| Concept | Remember this |
| --- | --- |
| `signal()` | Stores writable data |
| `computed()` | Derives read-only data |
| `set()` | Replaces signal value |
| `update()` | Updates using previous value |
| Lazy evaluation | Calculates when read |
| Memoization | Caches calculated result |
| Dependency tracking | Tracks signals read inside computed |
| Dynamic dependencies | Dependencies can change |
| `effect()` | Handles side effects |
| `resource()` | Handles asynchronous reactive data |

## 12. Best Official Angular 21 Resources

These are useful for deeper preparation:

- [Angular 21 – Deriving state with computed signals](<https://v21.angular.dev/tutorials/signals/2-deriving-state-with-computed-signals?utm_source=chatgpt.com>) – Practical Angular 21 tutorial.
- [Angular Signals – Official documentation](<https://angular.dev/guide/signals?utm_source=chatgpt.com>) – Detailed explanation of computed, dependencies and memoization.
- [Angular computed() API](<https://angular.dev/api/core/computed?utm_source=chatgpt.com>) – Official API reference.
- [Angular Effects documentation](<https://angular.dev/guide/signals/effect?utm_source=chatgpt.com>) – Understand computed versus effect.

## 13. The Most Important Interview Answer

If an interviewer asks:

"Why do we need computed signals when we already have normal signals?"

You can answer:

"Normal signals are used to store and manage application state, whereas computed signals are used to derive new values from existing signals.

Suppose I have height and width signals. I need to calculate the area whenever either value changes.

Without computed signals, I need to manually recalculate and synchronize the area whenever height or width changes.

With computed signals, Angular automatically tracks the dependencies, invalidates the previous calculated value when a dependency changes, and recalculates it when the computed value is next accessed.

Computed signals also provide lazy evaluation and memoization, which help avoid unnecessary calculations.

Therefore, computed signals make application code cleaner, more maintainable and more efficient."

Remember this for interviewsOne-line summary:

Normal signals store data. Computed signals automatically derive data from other signals. Angular manages their dependencies and cached values.
