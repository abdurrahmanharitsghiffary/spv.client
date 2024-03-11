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
import GroupsTab from "./groups-tab";
import { ChatRoomSimplified } from "@/types/chat";

type SearchType = "post" | "user" | "all" | "group";

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

  const tabContent = (() => {
    switch (type) {
      case "all": {
        return (
          <>
            <TabLayout>
              <h2 className="font-semibold px-4">Posts</h2>
              <PostsTab
                posts={(data as unknown as SearchAllData).posts?.data ?? []}
              />
            </TabLayout>
            <TabLayout>
              <h2 className="font-semibold px-4">Users</h2>
              <UsersTab
                users={(data as unknown as SearchAllData)?.users?.data ?? []}
              />
            </TabLayout>
            <TabLayout>
              <h2 className="font-semibold px-4">Groups</h2>
              <GroupsTab
                className="p-2"
                groups={(data as unknown as SearchAllData)?.groups?.data ?? []}
              />
            </TabLayout>
          </>
        );
      }
      case "group": {
        return <GroupsTab groups={data as unknown as ChatRoomSimplified[]} />;
      }
      case "post": {
        return <PostsTab posts={data as Post[]} />;
      }
      case "user": {
        return <UsersTab users={data as UserAccountPublic[]} />;
      }
      default: {
        return null;
      }
    }
  })();

  return (
    <>
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
          tabList: "font-semibold",
          cursor: "w-full data-selected",
        }}
        variant="underlined"
        color="primary"
      >
        <Tab key="all" title="All"></Tab>
        <Tab key="user" title="Users"></Tab>
        <Tab key="post" title="Posts"></Tab>
        <Tab key="group" title="Groups"></Tab>
      </Tabs>
      <TL type={type}>{isLoading ? loader : isSuccess && tabContent}</TL>
    </>
  );
}

function TL({
  type,
  children,
}: {
  children?: React.ReactNode;
  type: SearchType;
}) {
  return type === "all" ? (
    <div className="flex pt-3 pb-4 md:pt-0 flex-col gap-4">{children}</div>
  ) : (
    <TabLayout className="md:pb-4 ">{children}</TabLayout>
  );
}
