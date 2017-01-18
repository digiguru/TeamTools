
import {GenericCache, IIndexableObject} from "../Cache";

class Indexable implements IIndexableObject {
    id: string;
    input: string;
    constructor(id: string, input: string) {
        this.id = id;
        this.input = input;
    }
}

it("You can add to the cache", () => {
  // Arrange
  let c = new GenericCache();
  let input = new Indexable("ref", "Hello");
  // Act
  c.add(input).then((result) => {
    let resultToObj = (<Indexable>result[0]);
    // Assert
    expect(result.length).toBe(1);
    expect(resultToObj.id).toBe("ref");
    expect(resultToObj.input).toBe("Hello");
  });
});

it("Collisions in cache are not allowed", () => {
  // Arrange
  let c = new GenericCache();
  let input1 = new Indexable("ref", "Hello");
  let input2 = new Indexable("ref", "World");
  let result1;
  let result2;
  expect(() => {result1 = c.add(input1); }).not.toThrow();
  let failTest = (error) => {
    debugger;
    expect(error).toBeUndefined();
  };
  // Act
  result1.then((result1) => {
    let resultToObj1 = (<Indexable>result1[0]);
    // Assert
    expect(result1.length).toBe(1);
    expect(resultToObj1.id).toBe("ref");
    expect(resultToObj1.input).toBe("Hello");

    // Inner Act
    expect(() => {result2 = c.add(input2); }).not.toThrow();
    result2.then((result2) => {
      let resultToObj2 = (<Indexable>result2[1]);
      // Assert
      expect(result2.length).toBe(2);
      expect(resultToObj2.id).toBe("ref");
      expect(resultToObj2.input).toBe("World");
    }).catch(failTest);
  }).catch(failTest);
});