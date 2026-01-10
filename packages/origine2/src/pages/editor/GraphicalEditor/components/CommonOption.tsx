import { ReactNode } from "react";
import styles from './commonOption.module.scss';

interface ICommonOptionProps{
  title:string,
  children:ReactNode
  row?:boolean
  disableHover?: boolean
  className?: string
}

export default function CommonOptions(props:ICommonOptionProps){
  const className = [
    styles.item,
    props.disableHover ? styles.noHover : "",
    props.className ?? "",
  ].filter(Boolean).join(" ");
  return <div className={className}>
    <div className={styles.title}>{props.title}</div>
    <div className={styles.content}>{props.children}</div>
  </div>;
}
