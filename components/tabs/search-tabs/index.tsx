"use client";
import { Tab, Tabs } from "@nextui-org/tabs";
import React, { Suspense } from "react";
import TabLayout from "../../layout/tab-layout";
import UsersTab, { UserTabLoading } from "./users-tab";
import PostsTab, { PostTabLoading } from "./posts-tab";
import { useGetSearchResult } from "@/lib/api/search";
import { Key, SearchAllData } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Post } from "@/types/post";
import { UserAccountPublic } from "@/types/user";
import Search from "@/components/search";

type SearchType = "post" | "user" | "all";

export default function SearchTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = (searchParams.get("type") as SearchType) ?? "all";
  console.log(type, "Type");
  const { resp, isLoading, isSuccess } = useGetSearchResult({
    q,
    limit: 10,
    type,
  });

  const getUrl = (query?: Record<string, string>) => {
    const url = new URL(pathname, "http://localhost:3000");
    searchParams.forEach((v, k, p) => {
      url.searchParams.set(k, v);
    });
    for (let [k, v] of Object.entries(query ?? {})) {
      url.searchParams.set(k, v);
    }
    console.log(url.href.split(":3000")[1], "URL");
    return url.href.split(":3000")[1];
  };

  const handleSelectionChange = (key: Key) => {
    router.push(getUrl({ type: key as string }));
  };

  const data = resp?.data ?? [];

  const loader =
    type === "all" ? (
      <>
        <PostTabLoading />
        <UserTabLoading />
      </>
    ) : type === "post" ? (
      <PostTabLoading />
    ) : (
      <UserTabLoading />
    );

  const tabContent =
    type === "all" ? (
      <>
        <PostsTab
          posts={(data as unknown as SearchAllData).posts?.data ?? []}
        />
        <UsersTab
          users={(data as unknown as SearchAllData)?.users?.data ?? []}
        />
      </>
    ) : type === "post" ? (
      <PostsTab posts={data as Post[]} />
    ) : (
      <UsersTab users={data as UserAccountPublic[]} />
    );

  return (
    <>
      {/* <div className="fixed top-[13px] md:static right-3 z-[41] left-3">
        <Search />
      </div> */}
      <Suspense>
        <Search className="my-2 max-w-[280px] px-2 hidden md:block" />
      </Suspense>
      <Tabs
        onSelectionChange={handleSelectionChange}
        selectedKey={type}
        aria-label="Search..."
        className="fixed inset-x-0 z-[40] bg-background border-b-1 border-divider pt-0 px-2 pb-0 top-[60px] md:pb-auto md:static md:pb-2 md:mb-2 md:w-full md:px-0"
        classNames={{
          tabContent: "px-1",
          tab: "w-[54px]",
          cursor: "w-full data-selected",
        }}
        variant="underlined"
        color="primary"
      >
        <Tab key="all" title="All"></Tab>
        <Tab key="user" title="Users"></Tab>
        <Tab key="post" title="Posts"></Tab>
      </Tabs>
      <TabLayout>{isLoading ? loader : isSuccess && tabContent}</TabLayout>
    </>
  );
}
