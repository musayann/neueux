import { GetStaticProps } from "next";
import Layout from "components/Layout";
import React from "react";
import Header from "components/Header";
import { listScreenContent } from "lib/screen";
import { useRouter } from "next/router";
import Link from "next/link";
import { filteredTagsAll } from "lib/tags";
import { filteredUserflowsAll } from "lib/userflows";
import Filter from "components/filter";
import ScreenCard from "components/app/screen/Card";

const FilterPage = ({ screens, filter }) => {
  const router = useRouter();

  const filtered = () => {
    let userflows: any = router.query.userflows;
    let tags: any = router.query.tags;

    if (userflows && !Array.isArray(userflows)) {
      userflows = [userflows];
    }

    if (tags && !Array.isArray(tags)) {
      tags = [tags];
    }
    const filter = screens.filter((it) => {
      if (userflows && userflows.length) {
        return userflows.some((u) => it.userflows?.some((userflow) => userflow.id == u));
      }

      if (tags && tags.length) {
        return tags.some((t) => it.tags?.some((tag) => tag.id == t));
      }
      return true;
    }).reverse();

    // console.log(filter);

    return filter;
  };

  return (
    <Layout title="Filter" editable>
      <main className="w-11/12 mx-auto xl:relative">
        <Header title="Screen gallery" />
        <Filter
          tags={filter.tags}
          userflows={filter.userflows}
          routeParams={null}
          routePathname={null}
          fallbackRoutePathname={"/"}
        />
        <div className="flex flex-wrap">
          {filtered().map((screen) => {

            return (
              <div
                key={`screen-card-view-${screen.id}`}
                className={[
                  screen.device === "desktop"
                    ? "w-full lg:w-3/6"
                    : "lg:w-1/6 md:w-1/3 sm:w-1/6 w-1/2",
                  "px-2 mt-5",
                ].join(" ")}
              >
                <Link
                  href={{
                    pathname: `/apps/${screen.app}/screen/${screen.id}`,
                    query: {
                      referer: router.pathname,
                      ...router.query,
                    },
                  }}
                >
                  <a>
                    <ScreenCard url={screen.image} style={screen.device} />
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const screens = listScreenContent();
  const tags = filteredTagsAll(1, 30);
  const userflows = filteredUserflowsAll(1, 30);
  const pagination = {
    current: 1,
    pages: 1,
  };
  return {
    props: {
      screens: [...screens].reverse(),
      pagination,
      filter: {
        tags,
        userflows,
      },
      preview: preview || false,
    },
  };
};

export default FilterPage;
