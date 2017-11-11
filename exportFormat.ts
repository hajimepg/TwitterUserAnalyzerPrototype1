import User from "./user";

export default class ExportFormat {
    public followers: User[];
    public friends: User[];
    public followEachOther: User[];
    public followedOnly: User[];
    public followOnly: User[];
}
