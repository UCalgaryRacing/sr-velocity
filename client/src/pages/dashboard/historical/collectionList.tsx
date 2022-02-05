export interface Collection {
  id: number;
  name: string;
}

type Props = {
  collections: Collection[];
};

export default function CollectionList({ collections }: Props) {
  return (
    <div id="collection-list">
      {collections.length === 0 ? (
        <p>No Collections Found</p>
      ) : (
        collections.map((collection) => <div key={collection.id}>{collection.id}</div>)
      )}
    </div>
  );
}
