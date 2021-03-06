/**
 * Created by rtholmes on 2016-06-20.
 */

import fs = require('fs');
import _ = require('lodash');
import async = require('async');

const pathToRoot = __dirname.substring(0, __dirname.lastIndexOf('classportal/')) + 'classportal/';
var config = require(pathToRoot + 'config.json');

/**
 * Grab bag of methods that probably shouldn't be in the default namespace.
 *
 * @param msg
 */
export default class Log {

    public static trace(msg: string) {
        console.log("<T> " + new Date().toLocaleString() + ": " + msg);
    }

    public static info(msg: string) {
        console.log("<I> " + new Date().toLocaleString() + ": " + msg);
    }

    public static warn(msg: string) {
        console.error("<W> " + new Date().toLocaleString() + ": " + msg);
    }

    public static error(msg: string) {
        console.error("<E> " + new Date().toLocaleString() + ": " + msg);
    }

    public static test(msg: string) {
        console.log("<X> " + new Date().toLocaleString() + ": " + msg);
    }

}

/**
 * Helper methods for common file i/o actions.
 */
export class Helper {

    /**
     * This function cannot be optimised, so it's best to keep it small!
     * Original: http://stackoverflow.com/questions/29797946/handling-bad-json-parse-in-node-safely
     */
    static safelyParseJSON(json: any, callback: any) {
        try {
            var parsedJSON = JSON.parse(json);
            return callback(null, parsedJSON);
        } catch (error) {
            return callback(error, null);
        }
    }

    /**
     * Helper method for reading and parsing JSON data files.
     */
    static readJSON(filename: string, callback: any) {
        Log.trace("Helper::readJSON(..) - reading file: " + filename);
        var path = pathToRoot.concat(config.private_folder, filename);

        fs.readFile(path, function (error: any, data: any) {
            if (!error) {
                Helper.safelyParseJSON(data, function (error: any, parsedJSON: any) {
                    if (!error) {
                        Log.trace("Helper::readJSON(..) - read and parsed file successfully.");
                        return callback(null, parsedJSON);
                    } else {
                        Log.error("Helper::readJSON(..) - error parsing json: " + error);
                        return callback(error, null);
                    }
                });
            } else {
                Log.error("Helper::readJSON(..) - file read error.");
                return callback(true, null);
            }
        });
    }

    /**
     * Add or update key/value pairs in an existing entry in a JSON array.
     */
    static updateEntry(filename: string, identifierObject: any, newValuesObject: any, callback: any) {
        Log.trace("Helper::updateEntry(..) - start");
        var path = pathToRoot.concat(config.private_folder, filename);

        Helper.readJSON(filename, function (error: any, jsonFile: any) {
            if (!error) {
                // find index of entry containing values specified in identifierObject
                var index: number = _.findIndex(jsonFile, identifierObject);

                if (index !== -1) {
                    Log.trace("Helper::updateEntry(..) - found entry containing " + JSON.stringify(identifierObject));
                    var count: number = 0;

                    // update entry with each key/value in newValuesObject, then write to file.
                    async.forEachOfSeries(
                        newValuesObject,
                        function add_key_value(value: any, key: any, callback: any) {
                            Log.trace("Helper::updateEntry(..) - new key/value: {\"" + key + "\":" + value + "}");
                            jsonFile[index][key] = value;
                            count++;
                            return callback();
                        },
                        function end(error: any) {
                            if (!error) {
                                fs.writeFile(path, JSON.stringify(jsonFile, null, 2), function (error: any) {
                                    if (!error) {
                                        Log.trace("Helper::updateEntry(..) - successfully updated " + count + " value(s)!");
                                        return callback(null);
                                    } else {
                                        Log.error("Helper::updateEntry(..) - write error: " + error);
                                        return callback(error);
                                    }
                                });
                            } else {
                                Log.error("Helper::updateEntry(..) - error: " + error);
                                return callback(true);
                            }
                        }
                    );
                } else {
                    Log.error("Helper::updateEntry(..) - error: entry not found!");
                    return callback("entry not found");
                }
            } else {
                Log.error("Helper::updateEntry(..) - file read error");
                return callback(error);
            }
        });
    }

    /**
     * Add new entry to a JSON array of objects.
     */
    static addEntry(filename: string, newEntry: any, callback: any) {
        Log.trace("Helper::addEntry(..) - start");
        var path = pathToRoot.concat(config.private_folder, filename);

        Helper.readJSON(filename, function (error: any, jsonFile: any) {
            if (!error) {
                jsonFile.push(newEntry);
                Log.trace("Helper::addEntry(..) - adding new entry:\n" + JSON.stringify(newEntry, null, 2));

                fs.writeFile(path, JSON.stringify(jsonFile, null, 2), function (error: any) {
                    if (!error) {
                        Log.error("Helper::addEntry(..) - success!");
                        return callback(null);
                    } else {
                        Log.trace("Helper::::addEntry(..) - write error: " + error);

                        // create a backup
                        try {
                            fs.createReadStream(path).pipe(fs.createWriteStream(path + "_" + new Date().getTime()));
                        } catch (err) {
                            Log.error('Helper::addEntry() - error creating backup: ' + err.message);
                        }
                        return callback(error);
                    }
                });
            } else {
                Log.error("Helper::addEntry(..) - file read error");
                return callback(error);
            }
        });
    }

    /**
     * Check if all the key/value pairs in objectToCheck are found in the JSON array of objects.
     * If true, return the object.
     */
    static checkEntry(filename: string, objectToCheck: any, callback: any) {
        Log.trace("Helper::checkEntry(..) - start");
        var path = pathToRoot.concat(config.private_folder, filename);

        Helper.readJSON(filename, function (error: any, jsonFile: any) {
            if (!error) {
                var entry = _.find(jsonFile, objectToCheck);

                if (entry !== undefined) {
                    Log.trace("Helper::checkEntry(..) - entry found: " + JSON.stringify(entry));
                    return callback(null, entry);
                } else {
                    Log.trace("Helper::checkEntry(..) - error: entry not found!");
                    return callback("entry not found", null);
                }
            } else {
                Log.trace("Helper::checkEntry(..) - file read error");
                return callback(error, null);
            }
        });
    }

    /**
     * Delete an entry from the specified file.
     * The entry to be deleted is uniquely identified by matching all the key/value pairs in identifierObject.
     */
    static deleteEntry(filename: string, identifierObject: any, callback: any) {
        Log.trace("Helper::deleteEntry(..) - start");
        var path = pathToRoot.concat(config.private_folder, filename);

        Helper.readJSON(filename, function (error: any, jsonFile: any) {
            if (!error) {
                var index: number = _.findIndex(jsonFile, identifierObject);
                if (index !== -1) {
                    Log.trace("Helper::deleteEntry(..) - entry to be deleted: " + JSON.stringify(jsonFile[index]));

                    // use async library to ensure that the write happens AFTER the splice.
                    async.waterfall([
                            function splice_array(cb: any) {
                                jsonFile.splice(index, 1);
                                return cb();
                            }],
                        function write_file(err: any) {
                            fs.writeFile(path, JSON.stringify(jsonFile, null, 2), function (error: any) {
                                if (error) {
                                    Log.trace("Helper::deleteEntry(..) - write error: " + error);
                                    return callback(error);
                                } else {
                                    Log.trace(" Helper::deleteEntry(..) - delete successful!");
                                    return callback(null);
                                }
                            });
                        }
                    );
                } else {
                    Log.trace("Helper::deleteEntry(..) - error: could not find entry.");
                    return callback(true);
                }
            } else {
                Log.trace("Helper::deleteEntry(..) - file read error");
                return callback(error, null);
            }
        });
    }

    /**
     * Check if the supplied username belongs to an admin.
     */
    static isAdmin(username: string, callback: any) {
        Log.trace("Helper::isAdmin(..) - start");
        var filename = "admins.json";
        var path = pathToRoot.concat(config.private_folder, filename);

        Helper.readJSON(filename, function (error: any, jsonFile: any) {
            if (!error) {
                var index: number = _.findIndex(jsonFile, {"username": username});
                var isAdmin: boolean = index !== -1;
                Log.trace("Helper::isAdmin(..) - admin status: " + isAdmin);
                return callback(null, isAdmin);
            } else {
                Log.trace("Helper::isAdmin(..) - file read error");
                return callback(error, null);
            }
        });
    }

    // add or edit grade
    static addGrade(sid: string, assnId: string, grade: string, comment: string, callback: any) {
        Log.trace("Helper::addGrade(..) - start");
        var filename = "grades.json";
        var path = pathToRoot.concat(config.private_folder, filename);

        Helper.readJSON(filename, function (error: any, jsonFile: any) {
            if (!error) {
                Log.trace("Helper::addGrade(..) - finding index of student in grades");
                var studentIndex: number = _.findIndex(jsonFile, {"sid": sid});
                if (studentIndex !== -1) {
                    // check if grade for that assnId already exists
                    Log.trace("Helper::addGrade(..) - finding index of grade in grades.grades");
                    var assnIndex: number = _.findIndex(jsonFile[studentIndex].grades, {"assnId": assnId});

                    async.waterfall([
                        function assign(cb: any) {
                            if (assnIndex !== -1) {
                                // set grade
                                Log.trace("Helper::addGrade(..) - re-assigning old grade");
                                jsonFile[studentIndex].grades[assnIndex].grade = grade;
                                jsonFile[studentIndex].grades[assnIndex].comment = comment;
                            } else {
                                Log.trace("Helper::addGrade(..) - assigning new grade");
                                var newGrade = {
                                    assnId:  assnId,
                                    grade:   grade,
                                    comment: comment
                                };
                                jsonFile[studentIndex].grades.push(newGrade);
                            }
                            return cb();
                        }
                    ], function write(error: any) {
                        if (!error) {
                            Log.trace("Helper::addGrade(..) - writing to file");
                            fs.writeFile(path, JSON.stringify(jsonFile, null, 2), function (error: any) {
                                if (!error) {
                                    Log.error("Helper::addGrade(..) - success!");
                                    return callback(null);
                                } else {
                                    Log.trace("Helper::::addGrade(..) - write error: " + error);

                                    // create a backup
                                    try {
                                        fs.createReadStream(path).pipe(fs.createWriteStream(path + "_" + new Date().getTime()));
                                    } catch (err) {
                                        Log.error('Helper::addGrade() - error creating backup: ' + err.message);
                                    }
                                    return callback(error);
                                }
                            });
                        } else {
                            return callback("Failed to assign grades");
                        }
                    });

                } else {
                    Log.trace("Helper::addGrade(..) - error: student " + sid + " does not exist in grades.json");
                    return callback(error, null);
                }
            }
            else {
                Log.trace("Helper::addGrade(..) - file read error");
                return callback(error, null);
            }
        });
    }

    // add or edit grade
    static addGrades(student: any, callback: any) {
        Log.trace("Helper::addGrades(..) - start");
        Log.trace("Helper::addGrades(..) - data: " + JSON.stringify(student));
        var filename = "grades.json";
        var path = pathToRoot.concat(config.private_folder, filename);

        Helper.readJSON(filename, function (error: any, jsonFile: any) {
            if (!error) {
                Log.trace("Helper::addGrades(..) - finding index of student in grades");
                var studentIndex: number = _.findIndex(jsonFile, {"sid": student['sid']});
                if (studentIndex !== -1 || Array.isArray(student)) {
                    // check if grade for that assnId already exists
                    Log.trace("Helper::addGrades(..) - finding index of grade in grades.grades");

                    async.waterfall([
                        function assign(cb: any) {
                            if (Array.isArray(student)) {

                                for (var s of student) {
                                    // do many
                                    Log.trace("Helper::addGrades(..) - assigning grades");
                                    var studentIndex: number = _.findIndex(jsonFile, {"sid": s.sid});
                                    if (studentIndex !== -1) {
                                        Log.trace("Helper::addGrades(..) - assigning grade (set) for: " + s.sid);
                                        jsonFile[studentIndex]['grades'] = s.grades;
                                    } else {
                                        Log.trace("Helper::addGrades(..) - assigning grades; missing grades row for: " + s.sid);
                                    }
                                }
                            } else {
                                Log.trace("Helper::addGrades(..) - assigning grade (single) for: " + student.sid);
                                jsonFile[studentIndex]['grades'] = student['grades'];
                            }
                            return cb();
                        }
                    ], function write(error: any) {
                        if (!error) {
                            Log.trace("Helper::addGrades(..) - writing to file");
                            fs.writeFile(path, JSON.stringify(jsonFile, null, 2), function (error: any) {
                                if (!error) {
                                    Log.error("Helper::addGrades(..) - success!");
                                    return callback(null);
                                } else {
                                    Log.trace("Helper::::addGrades(..) - write error: " + error);

                                    // create a backup
                                    try {
                                        fs.createReadStream(path).pipe(fs.createWriteStream(path + "_" + new Date().getTime()));
                                    } catch (err) {
                                        Log.error('Helper::addGrades() - error creating backup: ' + err.message);
                                    }
                                    return callback(error);
                                }
                            });
                        } else {
                            return callback("Failed to assign grades");
                        }
                    });

                } else {
                    Log.trace("Helper::addGrades(..) - error: student " + student['sid'] + " does not exist in grades.json");
                    return callback(error, null);
                }
            }
            else {
                Log.trace("Helper::addGrades(..) - file read error");
                return callback(error, null);
            }
        });
    }

    static filterApps(teamsArray: any[], studentsArray: any[], isAdmin: boolean): any[] {
        Log.trace("Helper::addGrades(..) - start");
        var apps: any[] = [];

        teamsArray.forEach(function (team) {
            var app: any = {};
            app['name'] = team['appName'];
            app['url'] = team['url'];
            app['id'] = team['id'];
            app['description'] = team['appDescription'];
            app['comments'] = [];
            (team['comments'] as any[]).forEach(function (comment) {
                var filteredComment: any = {};
                filteredComment['description'] = comment['description'];
                filteredComment['ratting'] = comment['ratting'];
                filteredComment['approved'] = comment['approved'];

                if (isAdmin) {
                    var index = _.findIndex(studentsArray, {"sid": comment['sid']});
                    if (index !== -1) {
                        var studentName: string = studentsArray[index].firstname + " " + studentsArray[index].lastname;
                        filteredComment['sid'] = comment['sid'];
                        filteredComment['student'] = studentName;
                        filteredComment['approved'] = comment['approved'];
                        app['comments'].push(filteredComment);
                    }
                } else if (!!filteredComment['approved']) {
                    app['comments'].push(filteredComment);
                }
            });
            apps.push(app);
        });

        Log.trace("Helper::addGrades(..) - end");
        return apps;
    }

    // add a comment
    static addComment(sid: string, appID: string, ratting: string, comment: string, callback: any) {
        Log.trace("Helper::addComment(..) - start");
        var filename = "teams.json";
        var path = pathToRoot.concat(config.private_folder, filename);

        Helper.readJSON(filename, function (error: any, jsonFile: any) {
            if (!error) {
                Log.trace("Helper::addComment(..) - finding index of app in teams");
                var appIndex: number = _.findIndex(jsonFile, {"id": parseInt(appID)});
                if (appIndex !== -1) {
                    // check if grade for that assnId already exists


                    async.waterfall([
                        function assign(cb: any) {
                            Log.trace("Helper::addComment(..) - adding new comment");
                            var newComment = {
                                sid:         sid,
                                description: comment,
                                approved:    false,
                                ratting:     ratting
                            };
                            jsonFile[appIndex].comments.push(newComment);

                            return cb();
                        }
                    ], function write(error: any) {
                        if (!error) {
                            Log.trace("Helper::addComment(..) - writing to file");
                            fs.writeFile(path, JSON.stringify(jsonFile, null, 2), function (error: any) {
                                if (!error) {
                                    Log.error("Helper::addComment(..) - success!");
                                    return callback(null);
                                } else {
                                    Log.trace("Helper::::addComment(..) - write error: " + error);

                                    // create a backup
                                    try {
                                        fs.createReadStream(path).pipe(fs.createWriteStream(path + "_" + new Date().getTime()));
                                    } catch (err) {
                                        Log.error('Helper::addComment() - error creating backup: ' + err.message);
                                    }
                                    return callback(error);
                                }
                            });
                        } else {
                            return callback("Failed to assign grades");
                        }
                    });

                } else {
                    Log.trace("Helper::addComment(..) - error: app " + appID + " does not exist in teams.json");
                    return callback("App " + appID + " does not exist", null);
                }
            }
            else {
                Log.trace("Helper::addComment(..) - file read error");
                return callback(error, null);
            }
        });
    }

    // update comments
    static updateComments(appID: string, comments: any[], callback: any) {
        Log.trace("Helper::updateComments(..) - start");
        var filename = "teams.json";
        var path = pathToRoot.concat(config.private_folder, filename);

        Helper.readJSON(filename, function (error: any, jsonFile: any) {
            if (!error) {
                Log.trace("Helper::updateComments(..) - finding index of app in teams");
                var appIndex: number = _.findIndex(jsonFile, {"id": parseInt(appID)});
                if (appIndex !== -1) {
                    // check if grade for that assnId already exists

                    var updateComments: any[] = [];
                    comments.forEach(function (comment: any) {
                        updateComments.push(function update(cb: any) {
                            var commentIndex: number = _.findIndex(jsonFile[appIndex].comments, {
                                "sid":         comment.sid,
                                "description": comment.description,
                                "ratting":     parseInt(comment.ratting)
                            });
                            if (commentIndex !== -1) {
                                Log.trace("Helper::updateComments(..) - updating comment");
                                jsonFile[appIndex].comments[commentIndex].approved = comment.approved.toLowerCase() === 'true';
                            }

                            return cb();
                        })
                    });

                    async.waterfall(updateComments, function write(error: any) {
                        if (!error) {
                            Log.trace("Helper::updateComments(..) - writing to file");
                            fs.writeFile(path, JSON.stringify(jsonFile, null, 2), function (error: any) {
                                if (!error) {
                                    Log.error("Helper::updateComments(..) - success!");
                                    return callback(null);
                                } else {
                                    Log.trace("Helper::::updateComments(..) - write error: " + error);

                                    // create a backup
                                    try {
                                        fs.createReadStream(path).pipe(fs.createWriteStream(path + "_" + new Date().getTime()));
                                    } catch (err) {
                                        Log.error('Helper::updateComments() - error creating backup: ' + err.message);
                                    }
                                    return callback(error);
                                }
                            });
                        } else {
                            return callback("Failed to update comments");
                        }
                    });

                } else {
                    Log.trace("Helper::updateComments(..) - error: app " + appID + " does not exist in teams.json");
                    return callback("App " + appID + " does not exist", null);
                }
            }
            else {
                Log.trace("Helper::updateComments(..) - file read error");
                return callback(error, null);
            }
        });
    }
}