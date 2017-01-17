import {GenericCache,IIndexableObject} from "../Cache";

class Indexable implements IIndexableObject {
    id: string;
    input: string;
    constructor(id:string, input:string) {
        this.id = id;
        this.input = input;
    }
}

it('You can add to the cache', () => {
  //Arrange
  let c = new GenericCache();
  let input = new Indexable("ref","Hello");
  //Act
  c.add(input).then((result) => {
    let resultToObj = (<Indexable>result[0]);
    //Assert
    expect(result.length).toBe(1);
    expect(resultToObj.id).toBe("ref");
    expect(resultToObj.input).toBe("Hello");
  })
});