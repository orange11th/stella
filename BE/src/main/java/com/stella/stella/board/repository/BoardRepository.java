package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.BoardDeleteYN;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    int countByBoardIndex(Long BoardIndex);
    Optional<Board> findByBoardIndex(Long BoardIndex);

    int countByBoardLocation(Long BoardLocation);
    Page<Board> findByMemberMemberIndexAndBoardDeleteYN(Long MemberIndex, BoardDeleteYN boardDeleteYN, Pageable pageable);

    Page<Board> findByBoardIndexInAndBoardDeleteYN(List<Long> list, BoardDeleteYN boardDeleteYN,Pageable pageable);

}
