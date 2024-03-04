export type TreeStoreId = string | number;

interface TreeStoreItemAdjacency {
  item: TreeStoreItem;
  parent: TreeStoreItem | null;
  children: TreeStoreItem[];
}

type AdjacencyMap = Map<TreeStoreId, TreeStoreItemAdjacency>;

export interface TreeStoreItem {
  id: TreeStoreId;
  parent: TreeStoreId;
  type?: string | null;
}

export class TreeStore {
  private readonly adjacencies: AdjacencyMap;

  constructor(private readonly items: TreeStoreItem[]) {
    this.adjacencies = TreeStore.createAdjacencyMap(items);
  }

  public getAll(): TreeStoreItem[] {
    return this.items;
  }

  public get(id: TreeStoreId): TreeStoreItem | null {
    return this.adjacencies.get(id)?.item ?? null;
  }

  public getChildren(id: TreeStoreId): TreeStoreItem[] {
    return this.adjacencies.get(id)?.children ?? [];
  }

  public getDescendants(id: TreeStoreId): TreeStoreItem[] {
    const children: TreeStoreItem[] = this.getChildren(id);

    for (const child of children) {
      children.push(...this.getDescendants(child.id));
    }

    return children;
  }

  public getAncestors(id: TreeStoreId): TreeStoreItem[] {
    const ancestors: TreeStoreItem[] = [];
    let parent = this.adjacencies.get(id)?.parent;

    while (parent) {
      ancestors.push(parent);
      parent = this.adjacencies.get(parent?.parent)?.item;
    }

    return ancestors;
  }

  private static createAdjacencyMap(items: TreeStoreItem[]): AdjacencyMap {
    return new Map(
      items.map((item) => [
        item.id,
        {
          item,
          children: items.filter((i) => i.parent === item.id),
          parent: items.find((i) => item.parent === i.id) ?? null,
        },
      ])
    );
  }
}
