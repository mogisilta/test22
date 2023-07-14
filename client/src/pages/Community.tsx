import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import backgroundImg from '../assets/Community_background.png';
import PageButton from '../components/PageButton';
import { useNavigate, useParams } from 'react-router-dom';
import { Mocktags } from '../assets/mockdata.ts';
import ScrollBanner from '../components/common/ScrollBanner.tsx';
import ContentsCard from '../components/common/ContentsCard.tsx';
import PopularContentsSection from '../components/common/PopularContentsSection.tsx';
import TagSearchSection from '../components/common/TagSearchSection.tsx';
import { motion } from 'framer-motion';
import { getTotalCommunityPost } from '../api/CommunityApi/CommunityApi.ts';
import { useQuery } from '@tanstack/react-query';
import { CommunityPostData } from '../types/CommunityTypes.ts';
type SearchInput = {
    Keyword: string;
};
const PAGE_COUNT = 5;

const Community = () => {
    const { page: pageStr } = useParams();
    const page = Number(pageStr);
    const [size, setSize] = useState<number>(6);
    const [currTag, setCurrTag] = useState<string>(Mocktags[0]);
    const [totalPageArr, setTotalPageArr] = useState<Array<number>>([]);
    const [pageArr, setPageArr] = useState<Array<number>>([]);
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<SearchInput> = useCallback((data) => {
        //검색 api 요청 추가, Query key로 currTag, searchKeyword, currPage 넣기.
        console.log(data);
    }, []);

    const {
        isLoading,
        error: errorData,
        data: allCommunityData,
    } = useQuery(
        ['community', page],
        () => {
            console.log(`${page}페이지의 데이터를 가져옵니다.`);
            return getTotalCommunityPost(page, size);
        },
        {
            staleTime: 10000, // 10초
        },
    );

    useEffect(() => {
        if (allCommunityData) {
            const totalPageNum = allCommunityData.pageInfo.totalPages;
            const totalPageArr = [...Array(totalPageNum).keys()].map((x) => x + 1);
            const firstPageNum = Math.floor((page - 1) / PAGE_COUNT) * PAGE_COUNT + 1; //page가 1~5일 때는 1
            const lastPageNum =
                totalPageNum > Math.ceil(page / PAGE_COUNT) * PAGE_COUNT
                    ? Math.ceil(page / PAGE_COUNT) * PAGE_COUNT
                    : totalPageNum; //page가 1~5일 때는 5
            setTotalPageArr(totalPageArr);
            setPageArr([...totalPageArr.slice(firstPageNum - 1, lastPageNum)]);
        }
    }, [allCommunityData, page]);

    const handlePageList = (e: React.MouseEvent<HTMLLIElement>) => {
        if (
            e.currentTarget.innerText === '다음' &&
            pageArr[pageArr.length - 1] !== totalPageArr[totalPageArr.length - 1]
        ) {
            navigate(`/community/${pageArr[pageArr.length - 1] + 1}`);
        }

        if (e.currentTarget.innerText === '이전' && !pageArr.includes(1)) {
            navigate(`/community/${pageArr[0] - PAGE_COUNT}`);
        }
    };

    const handleNavigateCreate = () => {
        navigate('/community/create', { state: 'community' });
    };

    const handleCurrPage = (e: React.MouseEvent<HTMLLIElement>) => {
        const clickedPageNum = Number(e.currentTarget.innerText);
        navigate(`/community/${clickedPageNum}`);
    };

    if (isLoading) {
        return <div>로딩중..!</div>;
    }
    if (errorData) {
        return <div>에러발생..!</div>;
    }

    return (
        <CommunityWarp initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScrollBanner bannerImg={backgroundImg} />
            <CommunityContainer>
                <PopularContentsSection />
                <TagSearchSection
                    currTag={currTag}
                    setCurrTag={setCurrTag}
                    onSubmit={onSubmit}
                    handleNavigateCreate={handleNavigateCreate}
                />
                <BottomSection>
                    <AllPostContainer>
                        {allCommunityData?.postData.map((item: CommunityPostData) => (
                            <ContentsCard key={`all_${item.standardId}`} communityProps={item} type={'community'} />
                        ))}
                    </AllPostContainer>
                    <PageContainer>
                        <PageButton onClick={handlePageList} data={{ value: '이전', page }} />
                        {pageArr.map((value, idx) => (
                            <PageButton key={idx} onClick={handleCurrPage} data={{ value, page }} />
                        ))}
                        <PageButton onClick={handlePageList} data={{ value: '다음', page }} />
                    </PageContainer>
                </BottomSection>
            </CommunityContainer>
        </CommunityWarp>
    );
};

export default Community;

const CommunityWarp = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    width: 100%;
    background: linear-gradient(to right, #f8fcff, #f8fbff);
    margin-bottom: 40px;
`;

const CommunityContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 1280px;
    button {
        border: none;
        &:active {
            box-shadow: 0px -1px 9px 0px rgba(0, 0, 0, 0.75) inset;
            -webkit-box-shadow: 0px -1px 9px 0px rgba(0, 0, 0, 0.75) inset;
            -moz-box-shadow: 0px -1px 9px 0px rgba(0, 0, 0, 0.75) inset;
        }
    }
`;

const AllPostContainer = styled.ul`
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 330px;
    flex-grow: 1;
    width: 100%;
    height: 50%;
    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
    }
`;

const BottomSection = styled.section`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const PageContainer = styled.ul`
    padding: 0;
    width: 385px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    > li {
        margin: 0 3px 0 3px;
        border: none;
    }
`;
