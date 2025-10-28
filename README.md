# Intensity Segments

A JavaScript implementation for managing intensity values across segments.

## Install

```bash
pnpm install
```

## Test

```bash
pnpm test
```

## Usage

```javascript
import { IntensitySegments } from "./src/IntensitySegments.js";

const segments = new IntensitySegments();

segments.add(10, 30, 1);
console.log(segments.toString()); // "[[10,1],[30,0]]"

segments.add(20, 40, 1);
console.log(segments.toString()); // "[[10,1],[20,2],[30,1],[40,0]]"
```
