"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getContentFaq,
  selectIsContent,
} from "@/lib/features/content/contentSlice";
import HTMLServerParser from "@/components/HTMLServerParser";
import SkeletonAccounts from "@/components/loading/SkeletonAccounts";

const FaqWrapper = () => {
  const dispatch = useAppDispatch();
  const { isLoading, faqData } = useAppSelector(selectIsContent);

  useEffect(() => {
    dispatch(getContentFaq());
  }, [dispatch]);

  useEffect(() => {
    if (!faqData?.LW3CNTSTR) return;

    const questionDivs = document.querySelectorAll<HTMLDivElement>(
      "#faq .flex.justify-between.p-4.font-medium",
    );

    questionDivs.forEach((questionDiv) => {
      // Insert chevron if not exists
      if (!questionDiv.querySelector(".chevron")) {
        const chevron = document.createElement("span");
        chevron.className =
          "chevron ml-2 transition-transform duration-300 ease";
        chevron.innerHTML = "&#9656;"; // Unicode ▶
        questionDiv.appendChild(chevron);
      }

      const answer = questionDiv.nextElementSibling as HTMLElement | null;
      if (answer && answer.classList.contains("p-4")) {
        answer.style.display = "none";
      }
    });

    const handleClick = (questionDiv: HTMLDivElement) => () => {
      const answer = questionDiv.nextElementSibling as HTMLElement | null;
      const chevron = questionDiv.querySelector(
        ".chevron",
      ) as HTMLElement | null;

      if (answer && answer.classList.contains("p-4")) {
        const isOpen = answer.style.display === "block";
        answer.style.display = isOpen ? "none" : "block";

        if (chevron) {
          chevron.style.transform = isOpen ? "rotate(0deg)" : "rotate(90deg)";
        }
      }
    };

    questionDivs.forEach((questionDiv) => {
      questionDiv.style.cursor = "pointer";
      questionDiv.addEventListener("click", handleClick(questionDiv));
    });

    return () => {
      questionDivs.forEach((questionDiv) => {
        const cloned = questionDiv.cloneNode(true) as HTMLDivElement;
        questionDiv.parentNode?.replaceChild(cloned, questionDiv);
      });
    };
  }, [faqData]);
  return (
    <>
      {isLoading && (
        <div className="container mx-auto px-4">
          <SkeletonAccounts />
        </div>
      )}
      {faqData?.LW3CNTSTR && <HTMLServerParser content={faqData?.LW3CNTSTR} />}
    </>
  );
};

export default FaqWrapper;
