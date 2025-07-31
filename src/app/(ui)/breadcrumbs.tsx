//? NEXT
import Link from "next/link";
//? CLSX | Styling w/ Logic
import clsx from "clsx";

//? TYPESCRIPT Interface | Braedcrumbs
interface Breadcrumb {
  //* The text label for the breadcrumb.
  label: string;
  //* The URL that the breadcrumb should link to.
  href: string;
  //* Optional boolean flag indicating whether breadcrumb is active.
  active?: boolean;
};

export default function Breadcrumbs({
  //* Destructuring the props object to extract the breadcrumbs array.
  breadcrumbs, 
}: {
  //* Specifying type of the "breadcrumbs" prop as an array of Breadcrumb objects.
  breadcrumbs: Breadcrumb[];
}) {

  return ( //? Rendering a navigation element w/ aria label for accessibility.
    <nav aria-label="breadcrumbs" className="text-sm">
      {/* Rendering an ordered list */}
      <ol className="flex items-center flex-wrap space-x-1" id="breadcrumb-bar">
        {/* Mapping over breadcrumbs array to render individual breadcrumb items.*/}
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <li
              //? Assigning unique key to each breadcrumb item based on href.
              key={breadcrumb.href}
              //? Setting aria-current attribute on "active" & ARIA attribute for screen readers
              aria-current={breadcrumb.active ? "page" : undefined}
              className={clsx(
                "flex items-center",
                //? Add slash before all except the first item
                index !== 0 && "before:content-['/'] before:mx-2 before:text-gray-500"
              )}
            >
              {breadcrumb.active ? (
                //? Breadcrumb is active (current page), render it as plain text
                <span className="text-gray-600 cursor-default">{breadcrumb.label}</span>
              ) : (
                //? Otherwise, regular link style
                <Link
                  href={breadcrumb.href}
                  className="text-gray-600 hover:text-gray-800 no-underline"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
