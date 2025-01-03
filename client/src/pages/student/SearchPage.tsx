import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { useState } from "react";
import { courses } from "@/assets/Types/interfaces";

const SearchPage = () => {
  const [searchparams] = useSearchParams();
  const [seletedCategories, setSelectedCategories] = useState<Array<string>>(
    []
  );
  const [sortByPrice, setSortByPrice] = useState<string>("");
  const query = searchparams.get("query");
  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: seletedCategories,
    sortByPrice,
  });
  const handleFilterChange = (categories: Array<string>, price: string) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  };
  const isEmpty = !isLoading && data?.payload.length === 0;
  return (
    <div className="max-w-7xl py-20 mx-auto space-y-4 px-4 md:px-0 ">
      <div>
        <h2 className="font-bold text-xl md:text-2xl">{`Results for Search "${query}"`}</h2>
        <p>
          Showing Results for{" "}
          <span className="text-blue-800 font-bold italic">{query}</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <Filter handleFilterChange={handleFilterChange} />
        <div className=" w-full md:w-1/2  ">
          {isLoading ? (
            <LoadingSpinner />
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.payload.map((course:courses) => (
              <SearchResult key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/" className="italic">
        <Button variant="link">Browse All Courses</Button>
      </Link>
    </div>
  );
};
