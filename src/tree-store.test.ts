import { TreeStore, TreeStoreItem } from "./tree-store";

const SEQUENTAL_ITEMS: TreeStoreItem[] = [
  { id: 1, parent: "root" },
  { id: 2, parent: 1, type: "test" },
  { id: 3, parent: 1, type: "test" },

  { id: 4, parent: 2, type: "test" },
  { id: 5, parent: 2, type: "test" },
  { id: 6, parent: 2, type: "test" },

  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
];

describe("Tree Store", () => {
  const store = new TreeStore(SEQUENTAL_ITEMS);

  describe("Get All", () => {
    it("An array with equivalent elements ordered the same way", () => {
      expect(store.getAll()).toStrictEqual(SEQUENTAL_ITEMS);
    });
  });

  describe("Get by id", () => {
    it("Existing element by correct numeric id", () => {
      expect(store.get(7)).toStrictEqual({ id: 7, parent: 4, type: null });
    });

    it("Retreiving by stringified correct id value failed", () => {
      expect(store.get("7")).toBeNull();
    });

    it("Retreiving by non-existing id value failed with null", () => {
      expect(store.get(69)).toBeNull();
    });
  });

  describe("Get children by id", () => {
    it("Using non-existing id will produce an empty array", () => {
      expect(store.getChildren(69)).toEqual([]);
    });

    it("An empty array if there are no children", () => {
      expect(store.getChildren(5)).toEqual([]);
    });

    it("Only direct descendants", () => {
      expect(store.getChildren(2)).toStrictEqual([
        SEQUENTAL_ITEMS[3],
        SEQUENTAL_ITEMS[4],
        SEQUENTAL_ITEMS[5],
      ]);
      expect(store.getChildren(4)).toStrictEqual([SEQUENTAL_ITEMS[6], SEQUENTAL_ITEMS[7]]);
    });
  });

  describe("Get descendents by id", () => {
    it("Using non-existing id will produce an empty array", () => {
      expect(store.getChildren(69)).toEqual([]);
    });

    it("An empty array if there are no children", () => {
      expect(store.getChildren(5)).toEqual([]);
    });

    it("Picking children recursively", () => {
      expect(store.getDescendants(2)).toStrictEqual([
        SEQUENTAL_ITEMS[3],
        SEQUENTAL_ITEMS[4],
        SEQUENTAL_ITEMS[5],
        SEQUENTAL_ITEMS[6],
        SEQUENTAL_ITEMS[7],
      ]);
    });
  });

  describe("Get ancestors", () => {
    it("An empty array if there are no ancestors", () => {
      expect(store.getAncestors(1)).toEqual([]);
    });

    it("An empty array if non-existing id", () => {
      expect(store.getAncestors(69)).toEqual([]);
    });

    it("Ancestors order from the deepest to the root element", () => {
      expect(store.getAncestors(7)).toStrictEqual([
        SEQUENTAL_ITEMS[3],
        SEQUENTAL_ITEMS[1],
        SEQUENTAL_ITEMS[0],
      ]);
    });
  });
});
