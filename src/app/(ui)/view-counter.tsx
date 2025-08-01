export default function ViewCounter({
  slug,
  allViews,
}: {
  slug: string;
  allViews: {
    slug: string;
    count: number;
  }[];
  trackView?: boolean; //* OPTIONAL: prop, defaults to undefined
}) {

  //? Find the entry in 'allViews' corresponding to the provided 'slug'
  const viewsForSlug = allViews && allViews.find((view) => view.slug === slug);

  //? Create a Number object based on the count from 'viewsForSlug', defaulting to 0 if undefined.
  const number = new Number(viewsForSlug?.count || 0);
  
  //* Return JSX structure for rendering the view counter.
  return (
    <div>
      {/* Display the formatted view count. */}
      {`${number.toLocaleString()} views`}
    </div>
  );
}
