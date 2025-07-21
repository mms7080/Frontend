import {fetch} from "../../../lib/server";
import MovieUploader from "../../../components/movie/upload/movieuploader";

export const metadata = {
    title: '영화 업로드 - FILMORA',
    description: '영화를 업로드할 수 있는 페이지입니다.',
};

export default async function MovieUploadPage() {
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    return <MovieUploader userInfo={userRes}/>;
}