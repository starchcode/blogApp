import server from "../utils/server";

export default function EditBtns ({ body, comment, setEditing, setBody, setDeleted}) {

    const updateComment = async () => {
        if (!body) return null;
        const updateComment = await server.put("/comments/" + comment.id, {
          body: body,
        });
        return updateComment;
      };

      const handleSave = async () => {
        const res = await updateComment();
        if (res && res.status === 204) {
          return setEditing(false);
        }
      };
    

        return (
          <div className="cm-btns">
            <button onClick={() => handleSave()}>Save</button>
            <button
              onClick={() => {
                setBody(comment.body);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        );
    
}