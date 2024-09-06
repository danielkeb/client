import UserAvatar from "@/components/global/UserAvatar";

export default function ReviewCard({ review }: { review: any }) {
  return (
    <>
      {review && (
        <div className="card card-compact mb-3 overflow-hidden rounded-md duration-300 hover:scale-[0.98]">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar
                  email={review?.user?.email}
                  name={review?.user?.firstName}
                  size="base"
                />
                <div>
                  <div className="text-xl font-bold">
                    {`${review?.user?.firstName} ${review?.user?.lastName}`}
                  </div>
                  <div className="text-sm">{`@${review?.user?.username}`}</div>
                </div>
              </div>
              <div>{review?.rating}/5</div>
            </div>
            <div className="mt-4">
              <div className="text-base">
                {review?.comment ? review?.comment : "[No comment]"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
