import {Header} from '../../../components';
import {fetch} from "../../../lib/server";
import MovieUploader from "../../../components/movie/upload/movieuploader";

export const metadata = {
    title: '영화 업로드 - FILMORA',
    description: '필모라는 최신 영화를 예매하고 리뷰할 수 있는 사이트입니다.',
};

export default async function MovieUploadPage() {
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    return <>
    <Header userInfo={userRes}/>
    <MovieUploader userInfo={userRes}/>
</>;
}