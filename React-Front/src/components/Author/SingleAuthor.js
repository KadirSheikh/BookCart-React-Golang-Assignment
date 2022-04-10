import classes from "./SingleAuthor.module.css";
import useCollapse from 'react-collapsed';

const SingleAuthor = (props) => {

  let isTotalBooksZero = false
  if (props.totalBooks === 0) {
    isTotalBooksZero = true

  }


  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (

    <div className={classes.collapsible}>
      <div className={classes.header} >

        <div className={classes.container}>
          <div>
            <p className={classes.name}>{props.name}</p>
            <p className={classes.email}>{props.email}</p>
          </div>

          <div>
            <h4>Total books : {props.totalBooks}</h4>
            <p {...getToggleProps()} className={classes.showBooks}> {!isExpanded ? 'Show Books' : 'Hide Books'}</p>
          </div>
        </div>


      </div>
      <div {...getCollapseProps()}>
        <div className={classes.content}>
          {
            props.books.map((book) => (
              <div key={book.id}>
                <p className={classes.bname}>{book.title}</p>
                <p className={classes.email}>{book.description}</p>
              </div>
            ))
            
          }
          {isTotalBooksZero && 
          <p>No books added yet.</p>
          }
        </div>
      </div>
    </div>


  );
};

export default SingleAuthor;
