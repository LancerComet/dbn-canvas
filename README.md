# DBN-ts

DBN (Design By Numbers) Language parser written in TypeScript, inspired by this article: [How to be* a compiler — make a compiler with JavaScript](https://medium.com/@kosamari/how-to-be-a-compiler-make-a-compiler-with-javascript-4a8a13d473b4#.r832qh7i8)

Designed to draw lines in canvas.

## Usage.
```ruby
# Draw in <canvas id="paper-canvas"></canvas>
Use #paper-canvas

# We need a white paper.
# 0 is black, 100 is white.
Paper 100

# Get a black pen.
Pen 0

# Draw a horizontal line in the middle of this canvas.
# Line startX startY endX endY
Line 0 50 100 50

# That's it!
```


## License

MIT.