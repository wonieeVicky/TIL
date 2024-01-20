{
  type Video = {
    id: string;
    title: string;
    url: string;
    data: string;
  };

  type VideoMetadata = Pick<Video, 'id' | 'title'>;

  // data를 모두 가져오므로 무거운 함수
  function getVideo(id: string): Video {
    return {
      id,
      title: 'video',
      url: 'https://..',
      data: 'byte-data..'
    };
  }

  // 기존 Video 타입에서 id와 title만 가져오는 함수
  function getVideoMetadata(id: string): VideoMetadata {
    return {
      id,
      title: 'title'
    };
  }
}
