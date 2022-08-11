window.onload = function(){
    const container =  document.querySelector(".container"),
          sectReply = container.querySelector(".section_reply"),
          btnMine = container.querySelector("#btnMycomment"),
          writeArea = sectReply.querySelector(".write_area"),
          replyArea = sectReply.querySelector(".reply_area"),
          newTxtArea = writeArea.querySelector("#newReply");

    const pop = document.querySelector("#popup"),
          popReplyArea = pop.querySelector(".reply_area"),
          btnPopClose = pop.querySelector(".btn_close");

    let editTag = document.createElement('div'),
        btnSubmit = editTag.querySelector("#submitEdit"),
        btnCancel = editTag.querySelector("#cancelEdit"),
        editTxt, newReplyTxt, newReply, cloneReply;


    document.addEventListener('click',({target}) => {
        let dataBtn = target.dataset.btn;

        switch (dataBtn) {
            case "new": //새로운 댓글 등록 버튼 클릭시
                addNewReply(newReply,target);
                break;
            case "reReplySubmit": //대댓글 등록 버튼 클릭시
                addNewReply(newReply,target);
                break;
            case "edit": //수정하기 버튼 클릭시
                editReply(target);
                break;
            case "delete": //삭제하기 버튼 클릭시
                deletReply(target);
                break;
            case "submit": //수정 후 등록하기 버튼 클릭시
                submitEditReply(target);
                break;
            case "cancel": //수정 후 취소 버튼 클릭시
                cancelSubmit(target);
                break;
        }
        
        // 타겟의 이름이 btn_more 일 때 수정,삭제 리스트 보여주기
        target.classList == "btn_more" ? openList(target) : closeList(target);

        // 타겟의 이름이 btn_comment 일 때 대댓글 창 보여주기
        if(target.classList == "btn_comment"){
            openReplyList(target);
        };
    });

    btnPopClose.addEventListener("click", popClose);
    btnMine.addEventListener("click",openPop);

    // 새로운 댓글 추가 및 대댓글 추가
    function addNewReply(newReply,btnSubmit){
        let parent = btnSubmit.dataset.btn == "new" ? btnSubmit.closest(".section_reply").querySelector(".write_area") : btnSubmit.closest(".reply_editer"),
            newVal = newTxtArea.value,
            newCommentVal = btnSubmit.dataset.btn == "new" ? newVal : btnSubmit.closest(".reply_editer").querySelector("textarea").value,
            childOrParent = btnSubmit.dataset.btn == "new" ? "parentReply" : "childReply",
            writer = document.querySelector(".write_area .writer").innerHTML,
            today = new Date(),
            date = today.getFullYear()+'.'+(today.getMonth()+1)+'.'+ today.getDate(),
            time =  today.getHours() + ":" + today.getMinutes();
         

        newReply = document.createElement('div');
        
        newReply.setAttribute("class","reply");
        newReply.setAttribute("data-who","me");

        newReplyTxt = '<div class="top">'
        newReplyTxt +=     '<div class="info">'
        newReplyTxt +=         '<p class="writer">'+ writer +'</p>'
        newReplyTxt +=         '<div class="date">'
        newReplyTxt +=             '<span>'+ date +'</span>'
        newReplyTxt +=             '<span>'+ time +'</span>'
        newReplyTxt +=         '</div>'
        newReplyTxt +=         '<div class="btn_wrap">'
        newReplyTxt +=             '<button type="button" class="btn_more" data-btn="'+ childOrParent +'"><span class="ir">더보기</span></button>'
        newReplyTxt +=             '<ul class="btn_list">'
        newReplyTxt +=                 '<li><a href="javascript:void(0);" data-btn="edit">수정하기</a></li>'
        newReplyTxt +=                 '<li><a href="javascript:void(0);" data-btn="delete">삭제하기</a></li>'
        newReplyTxt +=             '</ul>'
        newReplyTxt +=         '</div>'
        newReplyTxt +=     '</div>'
        newReplyTxt +=     '<div class="bot_inner">'
        newReplyTxt +=         '<div class="board">'
        newReplyTxt +=             '<p>'+ newCommentVal +'</p>'

        if(btnSubmit.dataset.btn == "new"){
            newReplyTxt +=             '<div class="respond_btn">'
            newReplyTxt +=                 '<a href="javascript:void(0);" class="btn_comment">답글</a>'
            newReplyTxt +=             '</div>'
        }

        newReplyTxt +=         '</div>'
        newReplyTxt +=     '</div>'
        newReplyTxt += '</div>'

        if(btnSubmit.dataset.btn == "new"){
            newReplyTxt += '<div class="bottom">'
            newReplyTxt +=     '<div class="reply_child">'
            newReplyTxt +=         '<div class="reply_editer">'
            newReplyTxt +=             '<textarea></textarea>'
            newReplyTxt +=             '<button type="button" data-btn="reReplySubmit">등록</button>'
            newReplyTxt +=         '</div>'
            newReplyTxt +=         '<div class="comment_wrap"></div>'
            newReplyTxt +=     '</div>'
            newReplyTxt += '</div>'
        }

        if(btnSubmit.dataset.btn == "new"){
            newReply.setAttribute("data-reply","parentReply");
        }else{
            newReply.setAttribute("data-reply","childReply");
        }

        if(newCommentVal !== ""){
            newReply.innerHTML = newReplyTxt;
            cloneReply = newReply.cloneNode(true);

            if(btnSubmit.dataset.btn == "new"){
                if(parent.querySelector("#secretReply").checked){
                    newReply.dataset.type = "secret";
                    cloneReply.dataset.type = "secret";
                };
               
                newTxtArea.value = "";
                replyArea.prepend(newReply);
                // 팝업에 동일한 댓글 추가
                popReplyArea.prepend(cloneReply);
                btnMine.classList.add("new");
            }else{
                let reReplyArea = btnSubmit.closest(".reply").querySelector(".comment_wrap");

                btnSubmit.closest(".reply_editer").querySelector("textarea").value = "";
                reReplyArea.append(newReply);
            };
            
        }else{
            alert("댓글을 입력하세요.");
            return false;
        };
    };

    // 수정 삭제 버튼 리스트 노출
    function openList(btn){
        let btnData = btn.dataset.btn,
            parent = btn.closest("div[data-reply]"),
            replyData = parent.dataset.reply;

        if(btnData == replyData){
            btn.closest('div[data-reply="' + btnData + '"]').classList.toggle("open");
        }
    };

    // 수정 삭제 버튼 리스트 숨기기
    function closeList(btn){
        let reply = document.querySelectorAll("div[data-reply]");
        
        for(let index = 0; index < reply.length; index++){
            reply[index].classList.remove("open");
        };
    };

    // 댓글 수정하기 클릭 시 태그 삽입
    function editReply(btnEdit){
        let reply = document.querySelectorAll("div[data-reply]"),
            parent = btnEdit.closest(".reply"),
            top = parent.querySelector(".top"),
            replyInner = parent.querySelector(".bot_inner");

        editTxt =    '<textarea placeholder="댓글을 입력해주세요." id="editReplyValue"></textarea>'
        editTxt +=    '<div class="list">'
        
        if(parent.dataset.type == "secret"){
            editTxt +=        '<input type="checkbox" id="editSecret" checked>'
        }else{
            editTxt +=        '<input type="checkbox" id="editSecret">'
        }
        
        if(parent.dataset.reply == "parentReply"){
            editTxt +=        '<label for="editSecret">비밀댓글</label>'
        }
        editTxt +=        '<button type="button" class="btn_submit" data-btn="submit" id="submitEdit">등록</button>'
        editTxt +=        '<button type="button" class="btn_cancel" data-btn="cancel" id="cancelEdit">취소</button>'
        editTxt +=    '</div>'
                
        parent.classList.remove("open");
        parent.classList.remove("show");
        editTag.setAttribute("class","edit_area");
        editTag.innerHTML = editTxt;

        for(let i = 0; i < reply.length; i++){
            parent.setAttribute("data-mode","editMode");
            top.append(editTag);

            if(parent.dataset.mode == "editMode"){
                replyInner.style.display = "none";
                reply[i].querySelector(".bot_inner").style.display = "block";
            }
        }        
    };

    // 댓글 수정하기 클릭 후 취소 버튼 클릭 했을 때
    function cancelSubmit(btnCancel){
        let replyInner = btnCancel.closest(".reply").querySelector(".bot_inner");
        btnCancel.closest(".reply").dataset.mode = "";
        replyInner.style.display = "block";
        editTag.remove();
    };

    // 댓글 수정하기 클릭 후 등록 클릭 했을 때
    function submitEditReply(btnSubmitEdit){
        let parent = btnSubmitEdit.closest(".reply"),
            replyInner = parent.querySelector(".bot_inner"),
            board = replyInner.querySelector(".board p")
            newValue = editTag.querySelector("#editReplyValue").value,
            secretInput = editTag.querySelector("#editSecret");
        
        if(secretInput.checked){
            parent.dataset.type = "secret";
        }else{
            parent.dataset.type = "";
        }
        
        if(newValue != ""){
            board.innerHTML = newValue;
            parent.dataset.mode = "";
            replyInner.style.display = "block";
            editTag.remove();
        }else{
            alert("댓글을 입력하세요.");
            return false;
        };       
    };

    // 댓글 삭제하기 눌렀을 때
    function deletReply(btnDelet){
        let parent = btnDelet.closest(".reply"),
            result = confirm("삭제하시겠습니까?");

        if(result){
            parent.remove();
        }else{
            parent.classList.remove("open");
        };
    };
    // 마이 코멘트 닫기 클릭 시 팝업 클로즈
    function popClose(){
        pop.style.display = "none";
        btnMine.classList.remove("new");
    };
    // 마이 코멘트 클릭 시 팝업 오픈
    function openPop(){
        pop.style.display = "block";
    };    
    // 대댓글 작성 및 리스트 노출
    function openReplyList(target){
        let parentNode = target.closest(".reply");
        parentNode.classList.toggle("show");
    };
};
